import { CustomerOAuth2Parameter } from './customer-oauth2-parameter.interface';

export interface CustomerOAuth2  {
    readonly authorizeURL: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;
    readonly authorizeURLParameters: CustomerOAuth2Parameter[];
    readonly accessTokenURLParameters: CustomerOAuth2Parameter[];
    readonly userInfoURLParameters: CustomerOAuth2Parameter[];
    readonly defaultGroups: string[];
}
