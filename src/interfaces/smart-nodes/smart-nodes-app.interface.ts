import { Theme } from '../settings/theme/theme.interface';
import { DrawingData } from '../drawing/drawing-data.interface';
import { Lang } from '../lang/lang.interface';
import { SnPage } from './smart-nodes-page.interface';

export interface SnApp {
    readonly id: string;
    readonly environment: 'web' | 'mobile';
    readonly pages: SnPage[];
    readonly icon: string;
    readonly description?: Lang[];
    readonly pageHeight: number;
    readonly pageWidth: number;
    readonly securityGroups: string[];
    readonly theme?: Theme;
    readonly drawing: DrawingData;
    readonly custom?: any;
}
