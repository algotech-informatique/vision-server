import { EnvironmentDirectory } from './environment-directory.interface';
import { BaseDocument } from '../base/base.interface';

export interface Environment extends BaseDocument {
    workflows: EnvironmentDirectory[];
    smartmodels: EnvironmentDirectory[];
    smartflows: EnvironmentDirectory[];
    reports: EnvironmentDirectory[];
    apps: EnvironmentDirectory[];
    smartTasks: EnvironmentDirectory[];
}
