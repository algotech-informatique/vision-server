import { SmartPermissions } from './smart-permissions.interface';
import { Lang } from '../lang/lang.interface';

export interface SmartPropertyModel {
    readonly uuid: string;
    readonly key: string;
    readonly displayName: Lang[];
    readonly keyType: string;
    readonly multiple: boolean;
    readonly items: string|string[];
    readonly composition: boolean;
    readonly defaultValue: any;
    readonly required: boolean;
    readonly system: boolean;
    readonly hidden: boolean;
    readonly validations: string[];
    readonly permissions: SmartPermissions;
    readonly description?: string;
}