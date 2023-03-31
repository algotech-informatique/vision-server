import { PairDto } from '@algotech-ce/core';

export interface Theme {
    readonly themeKey: string;
    readonly customColors: PairDto[];
}
