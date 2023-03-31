import { EnvironmentConnectorDto, EnvironmentDto, PatchPropertyDto } from '@algotech-ce/core';

export const environment: EnvironmentDto = {
    uuid: '6ae1f52f-b7f2-401d-bb87-6d16d443d0b6',
    workflows: [
        {
            uuid: '79822795-f45f-4cbf-9d2e-c9afd3394618',
            name: 'workflow 1',
            subDirectories: [],
        }, {
            uuid: '23d609cd-f7d7-468c-9c1d-b0bb446903f4',
            name: 'workflow 2',
            subDirectories: [
                {
                    uuid: '0f7da4ea-3a27-4640-b481-951ebafb5d2b',
                    name: 'workflow 2 sub directory',
                    subDirectories: [],
                },
            ],
        },
    ],
    smartmodels: [
        {
            uuid: 'bb7c94d4-095d-4cf1-bbe8-afbf3a20b35a',
            name: 'smartmodel 1',
            subDirectories: [],
        }, {
            uuid: '960a366e-9e03-4540-8f19-74db0bf051de',
            name: 'smartmodel 2',
            subDirectories: [
                {
                    uuid: '97a7f5e0-ec17-4fee-b3b3-cb4274ec6834',
                    name: 'smartmodel 2 sub directory 1',
                    subDirectories: [
                        {
                            uuid: 'b245f437-d0c6-4128-9a84-dc8fa6dd487a',
                            name: 'smartmodel 2 sub directory 2 sub directory',
                            subDirectories: [],
                        },
                    ],
                }, {
                    uuid: '97f44503-0f65-4102-b20c-13ae60c6d330',
                    name: 'smartmodel 2 sub directory 2',
                    subDirectories: [],
                },
            ],
        },
    ],
    smartflows: [
        {
            uuid: '4bf4e780-081e-4a5c-a29a-99a3be6d1350',
            name: 'smartflow 1',
            subDirectories: [],
            custom: [{
                key: 'test',
                value: 'toto',
                active: true,
            }]
        },
    ],
    reports: [
        {
            uuid: '8114ecf4-a2e2-4beb-8a5b-731d44ecef24',
            name: 'report 1',
            subDirectories: [],
        },
    ],
    apps: [],
    smartTasks: [
        {
            uuid: '9d0443bb-a990-4747-8e40-6ee8e5f11267',
            name: 'smartTask 1',
            subDirectories: [],
        },
    ],
};

export const connectorsParameters: EnvironmentConnectorDto[] = [{
    uuid: '4bf4e780-081e-4a5c-a29a-99a3be6d1350',
    name: 'New smartflow name',
    parameters: [{
        key: 'test',
        value: 'toto',
        active: true,
    }]
}];

export const connectorsParametersUpdate: EnvironmentConnectorDto[] = [{
    uuid: '4bf4e780-081e-4a5c-a29a-99a3be6d1350',
    name: 'New smartflow name',
    parameters: [{
        key: 'test',
        value: 'updated',
        active: true,
    }]
}, {
    uuid: '6df69f8c-b725-48b9-b2b0-64eb4ad769f7',
    name: 'smartflow 2',
    parameters: [{
        key: 'hello',
        value: 'world',
        active: true,
    }]
}];

export const createEnvironment: EnvironmentDto = {
    uuid: '24609d5e-62ca-4dd3-9936-3a5045183b5a',
    workflows: [],
    smartmodels: [
        {
            uuid: 'bb7c94d4-095d-4cf1-bbe8-afbf3a20b35v',
            name: 'smartmodel 1',
            subDirectories: [],
        }, {
            uuid: '960a366e-9e03-4540-8f19-74db0bf051d1',
            name: 'smartmodel 2',
            subDirectories: [
                {
                    uuid: '97a7f5e0-ec17-4fee-b3b3-cb4274ec68a1',
                    name: 'smartmodel 2 sub directory 1',
                    subDirectories: [
                        {
                            uuid: 'b245f437-d0c6-4128-9a84-dc8fa6dd481a',
                            name: 'smartmodel 2 sub directory 2 sub directory',
                            subDirectories: [],
                        },
                    ],
                }, {
                    uuid: '97f44503-0f65-4102-b20c-13aea0c6d110',
                    name: 'smartmodel 2 sub directory 2',
                    subDirectories: [],
                },
            ],
        },
    ],
    smartflows: [],
    reports: [],
    apps: [],
    smartTasks: [],
};

export const updateEnvironment: EnvironmentDto = {
    uuid: '24609d5e-62ca-4dd3-9936-3a5045183b5a',
    workflows: [
        {
            uuid: '79822795-f45f-4cbf-9d2e-c9afdaa94618',
            name: 'workflow 1',
            subDirectories: [],
        },
    ],
    smartmodels: [],
    smartflows: [
        {
            uuid: '4bf4e780-081e-4a5c-a29a-99a3beaa1350',
            name: 'smartflow 1',
            subDirectories: [],
        },
    ],
    reports: [],
    apps: [],
    smartTasks: [],
};

export const patchSet: PatchPropertyDto = {
    op: 'replace',
    path: '/smartflows/[0]/name',
    value: 'New smartflow name',
};

export const patchPush: PatchPropertyDto = {
    op: 'add',
    path: '/smartflows/[0]/subDirectories/[?]',
    value:
    {
        uuid: '2524f346-c154-4d26-800d-fb7a54168b00',
        name: 'sub smartflow',
        subDirectories: [],
    },
};

export const patchSetNoRespectModel: PatchPropertyDto = {
    op: 'add',
    path: '/workflows/[0]/test',
    value: 'erreur model',
};

export const patchPull: PatchPropertyDto = {
    op: 'remove',
    path: '/smartmodels/[1]/subDirectories/[1]',
};

export const patchRemove: PatchPropertyDto = {
    op: 'remove',
    path: '/workflows',
};

export const environmentPatched = {
    uuid: '2524f346-c154-4d26-800d-fb7a54168b00',
    name: 'sub smartflow',
    subDirectories: [],
};