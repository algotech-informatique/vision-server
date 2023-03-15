import { Lang } from '../lang/lang.interface';

export interface TaskModel {
    readonly uuid: string;
    readonly key: string;
    readonly type: string;
    readonly general: {
        readonly displayName: Lang[];
        readonly iconName: string;
        readonly profil: string;
    };
    readonly properties: {
        readonly services: {
            readonly uuid: string;
            readonly key: string;
            readonly type: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
            readonly cache: boolean;
            readonly execute: string;
            readonly api: string;
            readonly route: string;
            readonly header: {
                readonly key: string;
                readonly value: string;
            }[];
            readonly params: {
                readonly key: string;
                readonly value: any;
                readonly type: string;
            }[];
            readonly mappedParams: {
                readonly key: string;
                readonly value: string;
            }[];
            readonly body?: string;
            readonly return: {
                readonly type: string;
                readonly multiple: boolean;
            };
        }[];
        readonly expressions: {
            readonly key: string;
            readonly value: any;
            readonly type: string;
        }[];
        readonly transitions: {
            readonly uuid: string;
            readonly key: string;
            readonly displayName?: Lang[];
            readonly task: string;
            readonly data: {
                readonly uuid: string;
                readonly key: string;
                readonly type: string;
                readonly multiple: boolean;
                readonly placeToSave?: string[];
            }[];
            readonly position?: {
                readonly x: number;
                readonly y: number;
            };
        }[];
        readonly custom: any;
    };
    readonly position?: {
        readonly x: number;
        readonly y: number;
    };
}
