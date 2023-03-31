import { CustomerInitResultDto } from '@algotech-ce/core';

export const initOk: CustomerInitResultDto[] = [
    { key: 'customers', value: 'ok' },
    { key: 'users', value: 'ok' },
    { key: 'groups', value: 'ok' },
    { key: 'settings', value: 'ok' },
    { key: 'Smart Objects index', value: 'ok' },
    { key: 'Documents index', value: 'ok' },
    { key: 'Documents pipeline', value: 'ok' }];

export const initko = {
    errorMsg: [
        { lang: 'fr', value: 'customer already set up' }],
    hasError: true,
    httpCode: 400,
};

export const deleteESIndex: CustomerInitResultDto[] = [
    { key: 'Smart Objects index', value: 'ok' },
    { key: 'Documents index', value: 'ok' }];