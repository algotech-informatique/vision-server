import { BaseDocument } from '../base/base.interface';
import { SmartObject } from '../smart-objects/smart-object.interface';

export interface DisplayObject extends BaseDocument {
  readonly display: string;
  readonly smartObject: SmartObject;
}
