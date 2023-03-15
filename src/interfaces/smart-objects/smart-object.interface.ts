import { IndexStatus } from '@algotech/core';
import { ATSkills } from '../atskills/atskills.interface';
import { BaseDocument } from '../base/base.interface';

export interface SmartObject extends BaseDocument {
  readonly modelKey: string;
  readonly properties: [
    {
      readonly key: string;
      readonly value: any;
    }
  ];
  readonly skills: ATSkills;
}
