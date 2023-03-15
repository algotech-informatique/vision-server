export interface Credentials {
    readonly login: string;
    readonly password?: string;
    readonly bcryptPassword: string;
    readonly refreshToken?: string;
    readonly credentialsType: 'password' | 'oauth1' | 'oauth2';
    readonly credentialsToken: string;
    readonly expirationDate: number;
    readonly accessToken?: string;
    readonly idToken?: string;
    readonly creationDate: Date;
    readonly passwordLastUpdate: number;
    readonly history: string[];
    readonly counter: number;
    readonly blockedAccount?: boolean;
 }
