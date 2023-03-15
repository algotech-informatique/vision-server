export interface ESSearchSoQueryEquals {
  not: boolean;
  isNull?: boolean;
  isString?: boolean;
  isNumber?: boolean;
  isDate?: boolean;
  isDatetime?: boolean;
  isTime?: boolean;
  isBoolean?: boolean;
  values: {
    isFirst: boolean;
    value: any;
  }[]
}
