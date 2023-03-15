export class DrawingData {
    readonly lines: {
        readonly id: string;
        readonly points: number[][];
        readonly color: string;
        readonly penType: 'default' | 'marker' | 'highlighter' | 'brush' | 'eraser';
        readonly penScale: number;
    }[];
    readonly elements: any[];
}
