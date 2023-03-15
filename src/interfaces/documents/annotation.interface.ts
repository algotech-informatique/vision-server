import { AnnotationZone } from './annotation-position.interface';

export interface Annotation {
    readonly uuid: string;
    readonly annotation: string;
    readonly userId: string;
    readonly author: string;
    readonly dateCreation: Date;
    readonly zone: AnnotationZone;
}
