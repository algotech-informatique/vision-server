import { Lang } from '../lang/lang.interface';

export interface CustomerInit {

    customerKey: string;
    name: string;
    login: string;
    email: string;
    password: string;
    languages: Lang[];
}
