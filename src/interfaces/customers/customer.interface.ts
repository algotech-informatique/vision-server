import { BaseDocument } from '../base/base.interface';
import { Lang } from '../lang/lang.interface';
import { CustomerOAuth2 } from './customer-oauth2.interface';


export interface Customer extends BaseDocument {
    readonly name: string;
    readonly logoUrl: string;
    readonly languages: Lang[];
    readonly applicationsKeys: string[];
    readonly licenceKey: string;
    readonly oauth2?: CustomerOAuth2;
    readonly catchboxUrl?: string;
    readonly dataretreiverUrl?: string;
}
