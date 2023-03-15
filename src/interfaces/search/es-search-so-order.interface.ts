
export interface ESSearchSoOrder {
  isFirst: boolean;
  isScore?: boolean;
  key: 'properties.asKeyword' | 'properties.asBoolean' | 'properties.asNumber' | 'properties.asDate' | '_score';
  filter: string;
  order: 'asc' | 'desc';
}
