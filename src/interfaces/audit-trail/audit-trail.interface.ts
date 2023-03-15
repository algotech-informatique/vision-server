export interface AuditLog {
    readonly eventId: string;
    readonly eventActionCode: 'C' |
    'R' |
    'U' |
    'D' |
    'E';
    readonly eventDate: string;
    readonly httpStatusCode: number;
    readonly userId: string;
    readonly customerKey: string;
    readonly networkAccessPoint: string;
    readonly objectUuid: string;
    readonly objectTypeCode: 'user' |
    'group' |
    'customer' |
    'settings' |
    'document' |
    'smart-object' |
    'smart-model' |
    'workflow-model' |
    'workflow-instance' |
    'generic-list' |
    'tags' |
    'notifications' |
    'schedules';
    readonly objectModelKey?: string;
    readonly objectUuids?: string[];
    readonly isRealDelete?: boolean;
    readonly deletedObjects?: boolean;
    readonly notIndexedObjects?: boolean;
}
