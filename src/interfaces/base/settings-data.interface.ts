import { ApplicationModelDto, EnvironmentDto, GenericListDto, GroupDto, SettingsDto, SmartModelDto } from '@algotech-ce/core';

export interface SettingsData {
    apps: ApplicationModelDto[];
    smartmodels: SmartModelDto[];
    glists: GenericListDto[];
    groups: GroupDto[];
    settings: SettingsDto;
    environment: EnvironmentDto;
}