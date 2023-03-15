import { ESSearchSoQueryEquals } from "./es-search-so-query-equals.interface";
import { ESSearchSoQueryRange } from "./es-search-so-query-range.interface";

export interface ESSearchSoQuery {
  isFirst: boolean;
  keys: {
    isFirst: boolean;
    value: string;
  }[];
  regex?: any;  
  range?: ESSearchSoQueryRange;
  exists?: {
    not: boolean;
    keys: {
      isFirst: boolean;
      value: string;
    }[];
  }
  equals?: ESSearchSoQueryEquals;
}
