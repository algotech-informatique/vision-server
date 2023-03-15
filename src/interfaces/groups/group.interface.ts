import { BaseDocument } from '../base/base.interface';
import { GroupApplication } from './group-application.interface';


export interface Group extends BaseDocument {
    readonly key: string;
    readonly name: string;
    readonly description: string;
    readonly application: GroupApplication;
}
