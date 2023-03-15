import { SysQuery } from './sys-query.interface';

export interface SearchSO extends SysQuery {
  modelKey?: string;
  allModels?: boolean;
  deleted?: boolean;
  notIndexed?: boolean;
  searchParameters?: SysQuery;
  order?: any;
}
