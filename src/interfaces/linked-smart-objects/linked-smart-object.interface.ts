import { BaseDocument } from '../base/base.interface';
import { DisplayObject } from './display-smart-object.interface';
import { SmartModel } from '../smart-models/smart-model.interface';
import { SmartPropertyModel } from '../smart-models/smart-property-model.interface';

export interface LinkedSmartObject extends BaseDocument {
    readonly propertyKey: string;
    readonly isGeolocalisable: boolean;
    readonly isMultiple: boolean;
    readonly isComposition: boolean;
    readonly property: SmartPropertyModel;
    readonly linkedModel: SmartModel;
    readonly values: DisplayObject[];
}
