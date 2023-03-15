export interface ESSearchSoQueryRange {
  isNumber?: boolean;
  isDate?: boolean;
  isDatetime?: boolean;
  isTime?: boolean;
  ops: {
    isFirst: boolean;
    op: string;
    value: any;
  }[]
}
