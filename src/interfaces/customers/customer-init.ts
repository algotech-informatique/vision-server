import { Lang } from '../lang/lang.interface';

export interface CustomerInit {
    customerKey: string;
    firstName: string;
    lastName: string;
    login: string;
    email: string;
    password: string;
    languages: Lang[];
    defaultapplications: string[];
}
