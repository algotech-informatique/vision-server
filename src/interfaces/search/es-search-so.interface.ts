import { ESSearchSoOrder } from "interfaces";
import { ESSearchSoQuery } from "./es-search-so-query.interface";

export interface ESSearchSo {
  from?: number;
  size?: number;
  min_score?: number;
  has_sort?: boolean;
  sort?: ESSearchSoOrder[]
  modelKeys: string[];
  has_tags?: boolean;
  tags?: string[];
  filters: ESSearchSoQuery[];
  queries: ESSearchSoQuery[];
  has_must_queries: boolean;
}
