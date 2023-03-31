import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { from, Observable, of, throwError, TimeoutError, zip } from 'rxjs';
import { SmartTasksLogsService } from './smart-tasks-logs.service';
import { Model } from 'mongoose';

import { catchError, map, mergeMap } from 'rxjs/operators';
import { NotificationDto, PairDto, SmartTaskDto, WorkflowLaunchOptionsDto } from '@algotech-ce/core';
import { IdentityRequest, SmartTask, SmartTaskLog, SmartTaskPeriodicity, SmartTaskRepetition, User } from '../../interfaces';
import { UUID } from 'angular2-uuid';

import { Agenda, Job, JobAttributesData } from 'agenda/es';
import { UsersHead } from '../users/users.head';
import { SmartFlowsHead } from '../smart-flows/smart-flows.head';
import { WorkflowInterpretorHead } from '../workflow-interpretor/workflow-interpretor.head';

import moment from 'moment';
import * as _ from 'lodash';
import { AuthHead } from '../auth/auth.head';
import { NotificationsHead } from '../notifications/notifications.head';
const cluster = require('cluster');

@Injectable()
export class SmartTasksService {

    private agenda;

    constructor(
        @InjectModel('agendaJobs') private readonly AgendaJobs: Model<any>,
        private readonly smartTasksLogsService: SmartTasksLogsService,
        private readonly usersHead: UsersHead,
        private readonly smartFlowsHead: SmartFlowsHead,
        private readonly workflowInterpretorHead: WorkflowInterpretorHead,
        private readonly authHead: AuthHead,
        private readonly notificationHead: NotificationsHead,
    ) {
        process.stdout.write('unlock and bind angenda jobs...');
        this.agenda = new Agenda(
            {
                db: {
                    address: `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PWD)}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}`,
                    collection: 'agendaJobs',
                }
            });
    }

    _defineAndBindJobprocess(name: string) {
        const lockTime = 3 * 60 * 60 * 1000;
        this.agenda.define(name, { concurrency: 10000, lockLifetime: lockTime }, this._jobProcess.bind(this));
    }


    unlockAndBindJobs(customerKey?: string): Observable<boolean> {
        return this.start().pipe(
            mergeMap((stopped) => {
                if (!stopped) {
                    process.stdout.write('Agenda failed to stop');
                }
                const q = (customerKey != null) ? { 'data.customerKey': customerKey, 'data.deleted': false } : { 'data.deleted': false };
                return from(this.agenda.jobs(q));
            }),
            mergeMap((jobs) => {
                return zip(..._.map(jobs, job => {
                    job.attrs.lockedAt = null;
                    this._defineAndBindJobprocess(job.attrs.name);
                    return this._saveJob(job);
                }));
            }),
            mergeMap(() => (this.start())));
    }

    stop(): Observable<boolean> {
        return from(this.agenda.stop()).pipe(
            catchError(() => {
                return of(false);
            }),
            map(() => {
                return true;
            }),
        );
    }

    start(): Observable<boolean> {
        return from(this.agenda.start()).pipe(
            catchError(() => {
                return of(false);
            }),
            map(() => {
                return true;
            }),
        );
    }

    create(customerKey, smartTaskDto: SmartTaskDto): Observable<SmartTask> {
        smartTaskDto.uuid = (smartTaskDto.uuid) ? smartTaskDto.uuid : UUID.UUID();
        const smartTask: SmartTask = Object.assign(_.cloneDeep(smartTaskDto), { customerKey, deleted: false });
        const { periodicity }: SmartTask = smartTask;
        const start: Date = new Date(periodicity.dateRange.start);
        const { repeatEvery, daysOftheWeek, daysOftheMonth, monthsOftheYear, timeZone, skipImmediate } = periodicity;
        const job = this.agenda.create(smartTask.uuid, smartTask);
        this._defineAndBindJobprocess(smartTask.uuid);
        job.priority(smartTask.priority);

        if ((repeatEvery && repeatEvery.length > 0) ||
            (daysOftheWeek && daysOftheWeek.length > 0) ||
            (daysOftheMonth && daysOftheMonth.length > 0) ||
            (daysOftheMonth && monthsOftheYear.length > 0)) {
            job.repeatEvery(this._createcronFormat(periodicity, start), {
                startDate: periodicity.dateRange.start,
                endDate: periodicity.dateRange.end,
                timezone: timeZone,
                skipImmediate,
            });
        } else {
            job.schedule(start);
        }
        if (!smartTask.enabled) {
            job.disable();
        }
        return this._saveJob(job).pipe(
            mergeMap(saved => {
                if (!saved) {
                    return throwError(() => new BadRequestException('job not saved'));
                }

                if (cluster.isWorker) {
                    process.emit('message', { cmd: 'reload-schedule-tasks' }, this);
                }

                return of(smartTask);
            }));
    }

    update(customerKey: string, uuid: string, UpdatesmartTaskDto: SmartTaskDto) {
        return from(this.agenda.cancel({ 'name': uuid, 'data.customerKey': customerKey })).pipe(
            catchError(() => {
                return throwError(() => new BadRequestException('update failed'));
            }),
            mergeMap(() => {
                UpdatesmartTaskDto.uuid = uuid;
                return this.create(customerKey, UpdatesmartTaskDto);
            }));
    }

    setState(customerKey: string, uuid: string, isEnabled: boolean): Observable<boolean> {

        return from(this.agenda.jobs({ 'name': uuid, 'data.customerKey': customerKey, 'data.deleted': false })).pipe(
            mergeMap((jobs: any) => {
                if (jobs.length === 0) {
                    return throwError(() => new BadRequestException('setState no task found in base'));
                }
                if (isEnabled) {
                    jobs[0].enable();
                } else {
                    jobs[0].disable();
                }

                jobs[0].attrs.data.enabled = isEnabled;
                return this._saveJob(jobs[0]);
            }));
    }

    delete(customerKey: string, uuid: string): Observable<{ acknowledged: boolean }> {

        return this.setState(customerKey, uuid, false).pipe(
            mergeMap((disabled) => {
                if (!disabled) {
                    return of([]);
                }
                return from(this.agenda.jobs({ 'name': uuid, 'data.customerKey': customerKey }));
            }),
            mergeMap((jobs: any) => {
                if (jobs.length === 0) {
                    return throwError(() => new BadRequestException('delete no task found in base'));
                }
                const $data: any[] = _.map(jobs, (job) => {
                    job.attrs.data.deleted = true;
                    return this._saveJob(job);
                });
                return zip(...$data);
            }),
            map((dataChange: boolean[]) => {
                const filter: any[] = _.filter(dataChange, (data) => data === false);
                return (filter.length === 0);
            }),
            map((saved) => {
                if (saved && cluster.isWorker) {
                    process.emit('message', { cmd: 'reload-schedule-tasks' }, this);
                }
                return { acknowledged: saved };
            }));
    }

    deleteByFlowKey(customerKey: string, flowKey: string): Observable<{ acknowledged: boolean }[]> {

        return from(this.agenda.jobs({ 'data.customerKey': customerKey, 'data.flowKey': flowKey, 'data.deleted': false })).pipe(
            mergeMap((jobs: Job<JobAttributesData>[]) => {
                if (jobs.length === 0) {
                    return of([{ acknowledged: false }]);
                }

                const obs$: Observable<{ acknowledged: boolean }>[] = _.map(jobs, (job: Job<JobAttributesData>) => {
                    return this.delete(customerKey, job.attrs.data.uuid);
                });

                return zip(...obs$);
            }),
        );
    }

    findAll(customerKey: string, skip: number, limit: number, sort?: string, order?: string | number, status?: string): Observable<SmartTask[]> {
        const s = sort ? sort : 'nextRunAt';
        if ((!order && !sort) || order === 'desc' || order === -1) {
            order = -1;
        } else {
            order = 1;
        }

        let q = { 'data.customerKey': customerKey, 'data.deleted': false };
        q = (status && (status === '-1' || status === 'deleted')) ? Object.assign(q, { 'data.deleted': true }) :
            (status && (status === '1' || status === 'enabled')) ?
                Object.assign(q, { 'data.enabled': true }) :
                (status && (status === '0' || status === 'disabled')) ? Object.assign(q, { 'data.enabled': false }) : q;
        const aggregates: any = [
            { $match: q },
            { $sort: { [s]: order } },
            { $skip: skip },
            { $limit: limit },
            { $addFields: { 'data.nextRunAt': '$nextRunAt' } },
            { $replaceRoot: { newRoot: '$data' } }];
        aggregates.push(
        );
        return from(this.AgendaJobs.aggregate(aggregates));
    }

    _saveJob(job): Observable<boolean> {
        return from(job.save()).pipe(
            map(() => true),
            catchError(() => of(false)));
    }

    _createcronFormat(periodicity: SmartTaskPeriodicity, start: Date): string {
        const { repeatEvery, hoursOfTheDay, daysOftheWeek, daysOftheMonth, monthsOftheYear } = periodicity;
        const findIndex = _.findIndex(repeatEvery, (r: SmartTaskRepetition) => r.repeatType === 'days');
        const dateCron: string[] = (findIndex !== -1) ?
            this._getDayCron(repeatEvery[findIndex], daysOftheMonth, daysOftheWeek) :
            this._getMonthCron(_.find(repeatEvery, (r: SmartTaskRepetition) => r.repeatType === 'months'), start);

        const cronExpression = _.join(_.concat(
            this._getTimeCron(repeatEvery, hoursOfTheDay, start),
            dateCron,
        ), ' ');
        return cronExpression;
    }

    _getTimeCron(repeatEvery: SmartTaskRepetition[], hoursOfTheDay: number[], start: Date): string[] {
        const date: string[] = [
            start.getUTCSeconds().toString(),
            start.getUTCMinutes().toString(),
            this._getcron(start.getUTCHours(),
                (repeatEvery) ? _.find(repeatEvery, (r: SmartTaskRepetition) => r.repeatType === 'hours') : null, hoursOfTheDay, start.getHours()),
        ];
        return date;
    }

    _getDayCron(repeatEvery: SmartTaskRepetition, daysOftheMonth: number[], daysOftheWeek: number[]): string[] {
        const date = [
            (daysOftheMonth?.length === 0) ?
                (daysOftheWeek?.length === 0) ?
                    this._getcron(null, repeatEvery, [], '*') : '*'
                : _.join(daysOftheMonth, ','),
            '*',
            (daysOftheWeek?.length === 0) ? '*' : _.join(this._dayOfTheWeek(daysOftheWeek), ','),
        ];
        return date;
    }

    _dayOfTheWeek(days: number[]): number[] {
        const week: string[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return _.reduce(days, (result, day) => {
            result.push(week[day]);
            return result;
        }, []);
    }

    _getMonthCron(repeatEvery: SmartTaskRepetition, start: Date): string[] {
        const date: string[] =
            [
                start.getDate().toString(),
                (repeatEvery && repeatEvery.frequency > 1) ? (start.getMonth() + 1).toString() : '*',
                '*',
            ];
        return date;
    }

    _getcron(start, repeatEvery, repeatAt, defaultVal): string {
        const a = (start && repeatEvery && repeatEvery.frequency > 0) ? `${start}/${repeatEvery.frequency}` :
            (!start && repeatEvery && repeatEvery.frequency > 0) ? `*/${repeatEvery.frequency}` :
                (repeatAt && repeatAt.length > 0) ? _.join(repeatAt, ',') : `${defaultVal}`;
        return a;
    }

    _createLog(job, runAt, finishAt, fail: boolean, startLog: boolean, failureMsg?: string) {

        const smartTaskLog: SmartTaskLog = {
            customerKey: job.attrs.data.customerKey,
            deleted: false,
            runAt,
            finishAt,
            smartTaskUuid: job.attrs.name,
            status: (startLog) ? 'start' : (fail) ? 'failure' : 'success',
            uuid: '',
            failureMsg,
        };
        this.smartTasksLogsService.UpdateByJob(job.attrs.data.customerKey, smartTaskLog).subscribe();
    }

    _jobProcess(job, done) {
        const data: SmartTask = job.attrs.data;
        const now = Date.now();
        const runAt = moment(now).format('YYYY-MM-DD[T]HH:mm:ss');
        let finishAt;
        const end = (data.periodicity.dateRange.end) ? new Date(data.periodicity.dateRange.end).getTime() : -1;
        const start = (data.periodicity.dateRange.start) ? new Date(data.periodicity.dateRange.start).getTime() : -1;

        if (start === -1 || now < start) {
            done();
        }

        if (end !== -1 && (end < now)) {
            this.setState(job.attrs.data.customerKey, job.attrs.name, false).subscribe((disabled) => {
                const failureMsg = (disabled) ? 'job deadline reached, job disabled' : 'job deadline reached, error disabling job';
                job.fail(failureMsg);
                finishAt = moment().format('YYYY-MM-DD[T]HH:mm:ss');
                this._createLog(job, runAt, finishAt, true, false, failureMsg);
                done();
            }, () => done());
        }

        const identity: IdentityRequest = {
            login: 'sadmin',
            groups: ['sadmin'],
            customerKey: data.customerKey,
            sessionId: '',
        };

        switch (data.flowType) {
            case 'smartflow':
                this._createCronWorkSmartFlow(job, done, 'smartflow', runAt, data, identity);
                break;
            case 'workflow':
                this._createCronWorkSmartFlow(job, done, 'workflow', runAt, data, identity);
                break;
            // case 'mail':
            //     this._createCronMail(job, done, runAt, data.inputs);
            //     break;
            // case 'notify':
            //     this._createCronNotify(job, done, runAt, identity, data.inputs);
            //     break;
        }
    }

    findLogsForSmartTask(customerKey: string, uuid: string): Observable<SmartTaskLog[]> {
        return this.smartTasksLogsService.list(customerKey, { deleted: false, smartTaskUuid: uuid });
    }

    findByUuid(customerKey: string, uuid: string): Observable<SmartTask> {
        const q = { 'data.customerKey': customerKey, 'data.deleted': false, 'name': uuid };
        const aggregates: any = [
            { $match: q },
            { $addFields: { 'data.nextRunAt': '$nextRunAt' } },
            {
                $replaceRoot: { newRoot: '$data' },
            }];
        const agg$: Observable<SmartTask[]> = from(this.AgendaJobs.aggregate(aggregates));
        return agg$.pipe(
            catchError(() => null),
            map((data: SmartTask[]) => data && data.length > 0 ? data[0] : null),
        );
    }

    private _createCronWorkSmartFlow(job, done, type, runAt, data, identity) {
        const launchOptions: WorkflowLaunchOptionsDto = {
            key: data.flowKey,
            inputs: data.inputs,
            fromScheduler: true,
        };

        const createCron$: Observable<any> = (type === 'workflow') ?
            this.workflowInterpretorHead.startWorkflow({ identity, launchOptions }) :
            this.smartFlowsHead.startSmartFlow({ identity, launchOptions });

        this._createLog(job, runAt, '', false, true);
        createCron$.subscribe({
            next: (res) => {
                if (res) {
                    this._cronEndOK(job, done, runAt);
                } else {
                    this._cronEndKO('Any job data', job, done, runAt);
                }
            },
            error: (err) => {
                this._cronEndKO(err, job, done, runAt);
            },
        });
    }

    private _cronEndOK(job, done, runAt) {
        let finishAt;
        finishAt = moment().format('YYYY-MM-DD[T]HH:mm:ss');
        this._createLog(job, runAt, finishAt, false, false);
        done();
    }

    private _cronEndKO(err, job, done, runAt) {
        let finishAt;
        if (err instanceof TimeoutError) {
            finishAt = moment().format('YYYY-MM-DD[T]HH:mm:ss');
            this._createLog(job, runAt, finishAt, false, false);
            done();
        }
        job.fail(err);
        finishAt = moment().format('YYYY-MM-DD[T]HH:mm:ss');
        this._createLog(job, runAt, finishAt, true, false, err);
        done();
    }

    private _createCronMail(job, done, runAt, inputs: PairDto[]) {

        const url = this._findValue('url', inputs);
        const login = this._findValue('user', inputs);

        // TODO gérer le reset de mdp
        /* this.authHead.resetPasswordEndValidity({ url, login }).subscribe(
            () => {
                this._cronEndOK(job, done, runAt);
            },
            (err) => {
                this._cronEndKO(err, job, done, runAt);
            },
        ); */
    }

    private _createCronNotify(job, done, runAt, identity, inputs: PairDto[]) {
        const username = this._findValue('user', inputs);
        if (!username) {
            this._cronEndKO('Any user information', job, done, runAt);
            return;
        }
        this.usersHead.find({ identity, username }).pipe(
            mergeMap((user: User) => {
                const notification: NotificationDto = this._createNotification(inputs, user);
                return this.notificationHead.create({ identity, notification: notification as any });
            }),
        ).subscribe(
            () => {
                this._cronEndOK(job, done, runAt);
            },
            (err) => {
                this._cronEndKO(err, job, done, runAt);
            },
        );

    }

    private _createNotification(inputs: PairDto[], user: User): NotificationDto {

        const url = this._findValue('url', inputs);
        const path = `${url}/auth/assign-password-end/${null}`; // TODO gérer le reset de mdp
        const notif: NotificationDto = {
            uuid: UUID.UUID(),
            title: this._findValue('title', inputs),
            content: this._findValue('body', inputs),
            additionalInformation: '',
            author: 'sadmin',
            date: moment().format(),
            icon: 'fa-solid fa-comment-alt',
            state: {
                to: [
                    `usr:${this._findValue('user', inputs)}`,
                ],
                from: 'sadmin',
                read: [],
            },
            action: {
                key: 'link',
                object: (null) ? path : '', // TODO gérer le reset de mdp
            },
        };
        return notif;
    }

    private _findValue(key: string, inputs: PairDto[]) {
        const index = _.findIndex(inputs, (input: PairDto) => input.key === key);
        if (index !== -1) {
            return inputs[index].value;
        }
        return '';
    }
}
