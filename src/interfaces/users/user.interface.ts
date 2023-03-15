import { Credentials } from './user-credentials.interface';
import { UserPhone } from './user-phone.interface';
import { UserCareer } from './user-career.interface';
import { UserSkill } from './user-skill.interface';
import { UserCommunity } from './user-community.interface';
import { BaseDocument } from '../base/base.interface';
import { UserFavorites } from './user-favorites.interface';

export interface User extends BaseDocument {
    readonly preferedLang: string;
    readonly username: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly groups: string[];
    readonly enabled: boolean;
    readonly pictureUrl: string;
    readonly following: string[];
    readonly favorites: UserFavorites;
    readonly mobileToken?;
}
