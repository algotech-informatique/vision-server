import * as mongoose from 'mongoose';
import { ATSkillsGeolocationSchema } from './atskills-geolocation.schema';
import { ATSkillsSignatureSchema } from './atskills-signature.schema';
import { ATSkillsDocumentSchema } from './atskills-document.schema';
import { ATSkillsTagSchema } from './atskills-tag.schema';
import { ATSkillsMagnetSchema } from './atskills-magnet.schema';

export const ATSkillsSchema = new mongoose.Schema({
    atGeolocation: ATSkillsGeolocationSchema,
    atDocument: ATSkillsDocumentSchema,
    atSignature: ATSkillsSignatureSchema,
    atTag: ATSkillsTagSchema,
    atMagnet: ATSkillsMagnetSchema,
}, {_id: false, minimize: false});
