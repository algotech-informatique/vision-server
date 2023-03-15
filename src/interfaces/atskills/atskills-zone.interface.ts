import { Position } from './atskills-position.interface';

export interface Zone {
    readonly appKey: string;
    readonly magnetsZoneKey: string;
    readonly boardInstance?: string;
    readonly position: Position;
    readonly order: number;
}
