export class IdentityRequest {
    login: string;
    groups: string[];
    customerKey: string;
    sessionId?: string;
    azp?: string;
}
