import { SnView } from './smart-nodes-view.interface';
import { SnApp } from './smart-nodes-app.interface';

export interface SnVersion  {

    readonly uuid: string;
    readonly createdDate: string;
    readonly updatedDate?: string;
    readonly creatorUuid: string;
    readonly deleted: boolean;
    readonly view: SnView|SnApp;
}
