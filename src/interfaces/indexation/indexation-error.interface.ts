import { BaseDocument } from '../base/base.interface';

export interface IndexationError extends BaseDocument {
  error: any;
}
