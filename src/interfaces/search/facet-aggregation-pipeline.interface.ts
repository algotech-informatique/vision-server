import { SearchSOFilterDto } from "@algotech/core";

export interface FacetAggregationPipeline {
    key: string;
    filters?: SearchSOFilterDto[];
    pipeline: any[];
}
