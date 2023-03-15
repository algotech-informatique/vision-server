import { Injectable } from '@nestjs/common';
import { from, Observable, of, throwError } from 'rxjs';
import * as _ from 'lodash';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class DatabaseService {

    runQueryFirebird(connection: any, request: string): Observable<any> {
        const firebird = require('node-firebird');
        const options = {
            host: connection.host,
            port: connection.port,
            database: connection.database,
            user: connection.user,
            password: connection.password,
        };
        return new Observable((observer) => {
            try {
                firebird.attach(options, (connectionErr, db) => {
                    if (connectionErr) {
                        observer.error(connectionErr);
                    } else if (db) {
                        db.query(request, (err, result) => {
                            if (err) {
                                observer.error(err);
                            }
                            db.detach();

                            if (_.isArray(result)) {
                                result = _.map(result, (value) => {
                                    if (_.isObject(value)) {
                                        for (const [key, val] of Object.entries(value)) {
                                            if ((val as any)?.type === 'Buffer') {
                                                value[key] = this.ab2str((val as any).data);
                                            }
                                        }
                                    }
                                    return value;
                                });
                            }

                            observer.next(result);
                            observer.complete();
                        });
                    }
                });
            } catch (err) {
                observer.error(err);
            }
        });
    }

    private ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

    runQueryMysql(connection: any, request: string): Observable<any> {
        const mysql = require('mysql');
        const options = mysql.createConnection({
            host: connection.host,
            port: connection.port,
            database: connection.database,
            user: connection.user,
            password: connection.password,
        });

        return new Observable((observer) => {
            try {
                options.connect((errConnection) => {
                    if (errConnection) {
                        observer.error(errConnection);
                    }

                    options.query(request, (errQuery, results, fields) => {
                        if (errQuery) {
                            observer.error(errQuery);
                        }
                        options.end();
                        observer.next(results);
                        observer.complete();
                    });
                });
            } catch (err) {
                observer.error(err);
            }
        });
    }

    runQueryMssql(connection: any, request: string): Observable<any> {
        const sql = require('mssql');
        const options: any = {
            server: connection.host,
            database: connection.database,
            user: connection.user,
            password: connection.password,
            options: { },
        };

        if (connection.port) {
            options.port = connection.port;
        }
        if (connection.selfSignedCertificate) {
            options.options.trustServerCertificate = true;
        }
        if (connection.azure) {
            options.options.encrypt = true;
        }

        sql.on('error', (err) => {
            sql.close();
            return of([]);
        });

        return from(sql.connect(options)).pipe(
            mergeMap(() => {
                return from(sql.query(request));
            }),
            map((result: any) => {
                sql.close();
                return result?.recordset || result?.rowsAffected?.[0];
            }),
            catchError((err) => {
                sql.close();
                return of([]);
            }),
        );
    }

    // runQueryMongodb(connection: any, request: string): Observable<any> {
    //     const mongoClient = require('mongodb').MongoClient;
    //     const url: string = connection.host;
    //     const database: string = connection.database;

    //     return new Observable((observer) => {
    //         try {
    //             mongoClient.connect(url, (errConnection, client) => {
    //                 if (errConnection) {
    //                     observer.error(errConnection);
    //                 } else if (client) {
    //                     const db = client.db(database);
    //                     db.collection('groups').find({}).toArray(
    //                         (errQuery, res) => {
    //                             if (errQuery) {
    //                                 observer.error(errQuery);
    //                             }
    //                             client.close();
    //                             console.log(res);
    //                             observer.next(res);
    //                             observer.complete();
    //                         },
    //                     );
    //                 }
    //             });
    //         } catch (err) {
    //             observer.error(err);
    //         }
    //     });
    // }

    runQueryPostgre(connection: any, request: string): Observable<any> {
        const { Client } = require('pg');
        const client = new Client({
            user: connection.user,
            host: connection.host,
            database: connection.database,
            password: connection.password,
            port: connection.port,
        });
        client.connect();

        return new Observable((observer) => {
            try {
                client.query(request, (err, res) => {
                    if (err) {
                        observer.error(err);
                    }
                    client.end();
                    observer.next(res?.rows);
                    observer.complete();
                });
            } catch (err) {
                observer.error(err);
            }
        });
    }

    runQueryOracle(connection: any, request: string): Observable<any> {
        const oracledb = require('oracledb');
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        const options = {
            user: connection.user,
            password: connection.password,
            connectString: connection.host,
        };

        return new Observable((observer) => {
            try {
                oracledb.getConnection(options, (connectionError, client) => {
                    if (connectionError) {
                        observer.error(connectionError);
                    }
                    else if (client) {
                        client.execute(request, (error, result) => {
                            if (error) {
                                observer.error(error);
                            }
                            client.close();
                            observer.complete();
                        });
                    }
                });
            } catch (err) {
                observer.error(err);
            }
        });
    }

    dbRequest(connection: any, request: string): Observable<any> {
        switch (connection.type) {
            case 'firebird':
                return this.runQueryFirebird(connection, request);
            case 'mysql':
                return this.runQueryMysql(connection, request);
            case 'mssql':
                return this.runQueryMssql(connection, request);
            // case 'mongodb':
            //     return this.runQueryMongodb(connection, request);
            case 'postgre':
                return this.runQueryPostgre(connection, request);
            case 'oracledb':
                return this.runQueryOracle(connection, request);
        }
        return throwError(() => new Error('Unknown DB type'));
    }

}