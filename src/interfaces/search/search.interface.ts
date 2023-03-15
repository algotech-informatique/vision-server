import { SearchSO } from "./search-so.interface";

export interface Search {
    query: SearchSO;
    search: string;
    skip: number;
    limit: number;
}