import { Injectable, BadRequestException } from '@nestjs/common';
import { Observable, from, of, zip, throwError, concat } from 'rxjs';
import * as _ from 'lodash';
import { catchError, map, mergeMap, toArray } from 'rxjs/operators';
import { InjectConnection } from '@nestjs/mongoose';
import { EMailDto } from '@algotech-ce/core';
import { Group, IdentityRequest, User } from '../../interfaces';
import { UsersService } from '../users/users.service';
import { GroupService } from '../groups/groups.service';
import { DocumentsHead } from '../documents/documents.head';
import { MongoGridFS } from 'mongo-gridfs';

@Injectable()
export class EmailService {

    _documentFS: MongoGridFS;
    get documentFS() {
        if (!this._documentFS && this.connection.db) {
            this._documentFS = new MongoGridFS(this.connection.db, 'documents');
        }
        return this._documentFS;
    }

    constructor(
        @InjectConnection() private readonly connection,
        private readonly documentsHead: DocumentsHead,
        private readonly groupService: GroupService,
        private readonly usersService: UsersService,
    ) { }

    sendEmail(email): Observable<any> {
        let transport = require('nodemailer').createTransport({
            service: 'ovh',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        return new Observable((observer) => {
            transport.sendMail(email, function (err) {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next();
                    observer.complete();
                }
            });
        });
    }

    sendEmailWithDto(identity: IdentityRequest, email: EMailDto) {
        const obsEmail = _.reduce(email.to, (results, to) => {
            results.push(this.getEmail(identity.customerKey, to));
            return results;
        }, []);

        return zip(...obsEmail).pipe(
            map((res: string[][]) => {
                const to = _.uniq(
                    _.reduce(res, (results, list) => {
                        results.push(...list);
                        return results;
                    }, []),
                );

                return _.join(to, ';');
            }),
            mergeMap((to: string) => {
                return this.getFiles(identity, email.linkedFiles).pipe(
                    map((files) => {
                        return {
                            to,
                            files,
                        };
                    }),
                );
            }),
            mergeMap((result) => {
                const e: any = {
                    to: result.to,
                    from: process.env.SMTP_FROM,
                    subject: email.subject,
                    attachments: _.reduce(result.files, (results, file) => {
                        if (file) {
                            results.push({   // file on disk as an attachment
                                filename: file.filename,
                                content: file.stream,
                            });
                        }
                        return results;
                    }, []),
                };

                if (email.html) {
                    e.html = (email?.content) ? email.content.replace(/\n/g, '<br>') : ' '; //si html = '' mailService renvoi une erreur
                } else {
                    e.text = email?.content;
                }

                return this.sendEmail(e);
            }),
        );
    }

    private getFiles(identity: IdentityRequest, files: string[]): Observable<{ filename: string, stream }[]> {
        const obsFiles: Observable<{ filename: string, stream }>[] = _.map(files, (file) => {
            return this.documentsHead.getFileByUUID({ identity, uuid: file },
            ).pipe(
                mergeMap((document) => {
                    if (document?._id) {
                        return from(this.documentFS.readFileStream(document._id)).pipe(
                            map((stream) => {
                                return {
                                    filename: document.filename,
                                    stream,
                                };
                            }));
                    }
                    return of(null);
                }),
                catchError(() => of(null)));
        });

        return concat(...obsFiles).pipe(
            catchError((err) => throwError(() => err)),
            toArray(),
        );
    }

    private getEmail(customerKey: string, to: string): Observable<string[]> {
        if (to.startsWith('adress:')) {
            return of([to.replace('adress:', '')]);
        } else if (to.startsWith('usr:')) {
            return this.usersService.findOneByLogin(customerKey, to.substr(4)).pipe(
                map((user: User) => {
                    return [user.email];
                }),
                catchError(() => {
                    return [];
                }));
        } else if (to.startsWith('grp:')) {
            return this.groupService.findOneByKey(customerKey, to.substr(4)).pipe(
                mergeMap((group: Group) => {
                    return this.usersService.getEmailByGroup(customerKey, group.key).pipe(
                        map((list: string[]) => {
                            return list;
                        }),
                    );
                }),
                catchError(() => {
                    return [];
                }));
        } else {
            return throwError(() => new BadRequestException(`${to} is invalid`));
        }
    }
}