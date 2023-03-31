import { SearchSOFilterDto } from "@algotech-ce/core";

export interface FacetAggregationPipeline {
    key: string;
    filters?: SearchSOFilterDto[];
    pipeline: any[];
}
