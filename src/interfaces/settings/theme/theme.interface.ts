import { PairDto } from '@algotech/core';

export interface Theme {
    readonly themeKey: string;
    readonly customColors: PairDto[];
}
