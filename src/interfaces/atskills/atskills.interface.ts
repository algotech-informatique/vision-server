import { ATSkillsGeolocation } from './atskills-geolocation.interface';
import { ATSkillsSignature } from './atskills-signature.interface';
import { ATSkillsDocument } from './atskills-document.interface';
import { ATSkillsTag } from './atskills-tag.interface';
import { ATSkillsMagnet } from './atskills-magnet.interface';

export interface ATSkills  {

    readonly atGeolocation: ATSkillsGeolocation;
    readonly atDocument: ATSkillsDocument;
    readonly atSignature: ATSkillsSignature;
    readonly atTag: ATSkillsTag;
    readonly atMagnet: ATSkillsMagnet;
}
