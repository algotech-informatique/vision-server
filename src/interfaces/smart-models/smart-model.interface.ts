import { SmartPropertyModel } from './smart-property-model.interface';
import { SmartPermissions } from './smart-permissions.interface';
import { ATSkillsActive } from '../atskills/atskills-active.interface';
import { BaseDocument } from '../base/base.interface';
import { Lang } from '../lang/lang.interface';

export interface SmartModel extends BaseDocument {
    readonly key: string;
    readonly system: boolean;
    readonly displayName: Lang[];
    readonly uniqueKeys: string[];
    readonly domainKey: string;
    readonly properties: SmartPropertyModel[];
    readonly skills: ATSkillsActive;
    readonly permissions: SmartPermissions;
    readonly description?: string;
}
