import { SearchSOFilterDto } from '@algotech-ce/core';

export interface SysQuery {
  search?: string;
  filter?: SearchSOFilterDto[];
  order?: {
    key: string;
    value: any;
  }[];
  skip?: number;
  limit?: number;
}