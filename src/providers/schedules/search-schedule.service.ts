import { Injectable } from '@nestjs/common';
import { DateRange, ScheduleActivitiesSearch, ScheduleReceiversSearch,
    ScheduleSearch, ScheduleWorkflowsSearch } from '../../interfaces';
import * as _ from 'lodash';

@Injectable()
export class SearchScheduleService {

    private getStringQuery(fieldName: string, values: string[]): {} {
        const inTab = {};
        inTab[fieldName] = { $in: [] };
        inTab[fieldName].$in = _.concat(inTab[fieldName].$in, values);
        return inTab;
    }

    private getDateRangeQuery(fieldName: string, rangeArray: DateRange[]): {} {
        let newDate;
        let and;
        const or = { $or: [] };

        for (const dateRange of rangeArray) {
            const { start, end }: DateRange = dateRange;
            and = { $and: [] };
            if (start) {
                newDate = {};
                newDate[fieldName] = { $gte: new Date(start) };
                and.$and.push(newDate);
            }

            if (end) {
                newDate = {};
                newDate[fieldName] = { $lte: new Date(end) };
                and.$and.push(newDate);
            }

            or.$or.push(and);
        }
        return or;
    }

    private getGroupStages(): [] {
        const stages = [];
        const group = {
            $group: { _id: '$uuid', scheduleItem: { $first: '$$ROOT' } },
        };
        const replaceroot = { $replaceRoot: { newRoot: '$scheduleItem' } };
        stages.push(group);
        stages.push(replaceroot);
        return stages as [];
    }

    private getUnwindStages(fieldName: string): [] {
        const stages: any = [];
        const newName = fieldName + 'New';
        const addFields = { $addFields: {} };
        addFields.$addFields[newName] = '$' + fieldName;
        const unwind = {
            $unwind: {
                path: '$' + newName,
                preserveNullAndEmptyArrays: true,
            },
        };

        stages.push(addFields);
        stages.push(unwind);
        return stages;
    }

    private getActivitiesQuery(fieldName: string, activities: ScheduleActivitiesSearch): [] {
        const and = { $and: [] };
        const {
            beginRealDate,
            endRealDate,
            workflowModelKeys,
            workflowInstanceUuids,
        }: ScheduleActivitiesSearch = activities;
        let unwindStages;
        const stages = [];
        let key: string;

        if (beginRealDate) {
            key = fieldName + 'New' + '.' + 'beginRealDate';
            and.$and.push(this.getDateRangeQuery(key, beginRealDate));
        }

        if (endRealDate) {
            key = fieldName + 'New' + '.' + 'endRealDate';
            and.$and.push(this.getDateRangeQuery(key, endRealDate));
        }

        if (workflowModelKeys) {
            key = fieldName + 'New' + '.' + 'workflowModelKeys';
            and.$and.push(this.getStringQuery(key, workflowModelKeys));
        }

        if (workflowInstanceUuids) {
            key = fieldName + 'New' + '.' + 'workflowInstanceUuids';
            and.$and.push(this.getStringQuery(key, workflowInstanceUuids));
        }
        if (_.size(and.$and) > 0) {
            unwindStages = this.getUnwindStages(fieldName);
            for (const stage of unwindStages) {
                stages.push(stage);
            }
            stages.push({ $match: _.assign(and) });
            return stages as [];
        } else {
            return [];
        }
    }

    private getReceiversQuery(fieldName: string, receivers: ScheduleReceiversSearch): [] {
        let unwindStages;
        const stages = [];
        const and = { $and: [] };
        const {
            userUuid,
            groupUuid,
            permission,
        }: ScheduleReceiversSearch = receivers;
        let key: string;

        if (userUuid) {
            key = fieldName + 'New' + '.' + 'userUuid';
            and.$and.push(this.getStringQuery(key, userUuid));
        }

        if (groupUuid) {
            key = fieldName + 'New' + '.' + 'groupUuid';
            and.$and.push(this.getStringQuery(key, groupUuid));
        }

        if (permission) {
            key = fieldName + 'New' + '.' + 'permission';
            and.$and.push(this.getStringQuery(key, permission));
        }

        if (_.size(and.$and) > 0) {
            unwindStages = this.getUnwindStages(fieldName);
            for (const stage of unwindStages) {
                stages.push(stage);
            }
            stages.push({ $match: _.assign(and) });
            return stages as [];
        } else {
            return [];
        }
    }

    private getWorkflowsQuery(fieldName: string, workflows: ScheduleWorkflowsSearch): [] {
        const and = { $and: [] };
        const stages = [];
        let unwindStages;
        const {
            workflowUuid,
            parameters,
            profils,
        }: ScheduleWorkflowsSearch = workflows;
        let key: string;
        unwindStages = this.getUnwindStages(fieldName);
        for (const stage of unwindStages) {
            stages.push(stage);
        }

        if (workflowUuid) {
            key = fieldName + 'New' + '.' + 'workflowUuid';
            and.$and.push(this.getStringQuery(key, workflowUuid));
        }

        if (parameters) {
            key = fieldName + 'New' + '.' + 'parameters';
            unwindStages = this.getUnwindStages(key);
            for (const stage of unwindStages) {
                stages.push(stage);
            }
            if (parameters.key) {
                and.$and.push(this.getStringQuery(key + 'New' + '.' + 'key', parameters.key));
            }

            if (parameters.source) {
                and.$and.push(this.getStringQuery(key + 'New' + '.' + 'source', parameters.source));
            }
        }

        if (profils) {
            key = fieldName + 'New' + '.' + 'profils';
            unwindStages = this.getUnwindStages(key);
            for (const stage of unwindStages) {
                stages.push(stage);
            }

            if (profils.profil) {
                and.$and.push(this.getStringQuery(key + 'New' + '.' + 'profil', profils.profil));
            }

            if (profils.group) {
                and.$and.push(this.getStringQuery(key + 'New' + '.' + 'group', profils.group));
            }

            if (profils.login) {
                and.$and.push(this.getStringQuery(key + 'New' + '.' + 'login', profils.login));
            }
        }

        if (_.size(and.$and) > 0) {
            stages.push({ $match: _.assign(and) });
            return stages as [];
        } else {
            return [];
        }
    }

    getStagesFromScheduleSearch(customerKey: string, filter: ScheduleSearch): {} {
        const match = { $match: _.assign({ $and: [{ customerKey }, { deleted: false }] }) };
        const pripeline = [];
        const stages = [];
        const datekeys = ['creationDate', 'beginPlannedDate', 'endPlannedDate'];
        let nestedstages = [];
        let index;
        let keys = [];

        if (filter) {
            keys = Object.keys(filter);
        }

        if (_.size(keys) > 0) {
            for (const key of keys) {
                if (filter[key]) {
                    if (Array.isArray(filter[key])) {
                        index = _.indexOf(datekeys, key);
                        if (index !== -1) {
                            match.$match.$and.push(this.getDateRangeQuery(key, filter[key]));
                        } else {
                            match.$match.$and.push(this.getStringQuery(key, filter[key]));
                        }
                    } else {
                        if (key === 'scheduleStatus') {
                            match.$match.$and.push(this.getStringQuery(key, filter[key].key));
                        } else if (key === 'activitie') {

                            nestedstages = this.getActivitiesQuery(key, filter[key]);
                            for (const stage of nestedstages) {
                                stages.push(stage);
                            }
                        } else if (key === 'receivers') {

                            nestedstages = this.getReceiversQuery(key, filter[key]);
                            for (const stage of nestedstages) {
                                stages.push(stage);
                            }
                        } else if (key === 'workflows') {

                            nestedstages = this.getWorkflowsQuery(key, filter[key]);
                            for (const stage of nestedstages) {
                                stages.push(stage);
                            }
                        }
                    }
                }
            }
            pripeline.push(match);
            if (_.size(stages) > 0) {
                for (const stage of stages) {
                    pripeline.push(stage);
                }

                nestedstages = this.getGroupStages();
                for (const stage of nestedstages) {
                    pripeline.push(stage);
                }
            }
        }
        return pripeline;
    }
}
