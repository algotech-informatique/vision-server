import { CredentialsSchema } from './user-credentials.schema';
import { UserPhoneSchema } from './user-phone.schema';
import { UserCareerSchema } from './user-career.schema';
import { UserSkillSchema } from './user-skill.schema';
import { UserCommunitySchema } from './user-community.schema';
import { UserFavoritesSchema } from './user-favorites.schema';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    uuid: String,
    customerKey: String,
    deleted: Boolean,
    createdDate: Date,
    updateDate: Date,
    preferedLang: String,
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    groups: [String],
    enabled: Boolean,
    pictureUrl: String,
    following: [String],
    favorites: UserFavoritesSchema,
    mobileToken: String,
}, { minimize: false });
