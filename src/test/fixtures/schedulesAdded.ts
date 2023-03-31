import { ScheduleDto } from '@algotech-ce/core';

export const scheduleInBaseUpdated: ScheduleDto = {
    uuid: '',
    scheduleTypeKey: 'Equipement-Type',
    title: 'Maintenance equipement',
    creationDate: '2030-10-08T01:00:00.000Z',
    beginPlannedDate: '2030-10-08T01:00:00.000Z',
    endPlannedDate: '2030-10-08T01:00:00.000Z',
    emitterUuid: '110e8400-e29b-11d4-a716-446655440003',
    receivers: [
        {
            userUuid: '110e8400-e29b-11d4-a716-446655440000',
            groupUuid: '256b3672-6d60-11e8-adc0-fa7ae01bbebc',
            permission: 'R',
        },
        {
            userUuid: '110e8400-e29b-11d4-a716-446655440003',
            groupUuid: '88af50c0-6d5f-11e8-adc0-fa7ae01bbebc',
            permission: 'R',
        }],
    soUuid: [
        'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a',
    ],
    workflows: [
        {
            workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
            parameters: [
                {
                    key: 'smart-object-selected.test',
                    source: 'smart-object-selected.test',
                }],
            profils: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'technician',
                    login: 'rrr',
                },
                {
                    profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    group: 'admin',
                    login: 'rrree',
                }]
        }],
    repetitionMode: 'weekly',
    scheduleStatus: 'done',
    tags: [
        'test','test 2'
    ],
    assignedUserUuid: ['110e8400-e29b-11d4-a716-446655440003'],
    activities: [
        {
            beginRealDate: '2090-10-08T01:00:00.000Z',
            endRealDate: '2090-10-08T01:00:00.000Z',
            workflowModelKey: 'test 3',
            workflowInstanceUuid: 'b0783f55-dbc6-440a-8827-d38f2460d83f'
        }
    ],
    source: 'DIMO',
};

export const scheduleAdded: ScheduleDto = {
    scheduleTypeKey: 'Equipement-Type-1',
    title: 'Maintenance equipement-1',
    creationDate: '2019-10-08T00:00:00.000Z',
    beginPlannedDate: '2019-10-08T00:00:00.000Z',
    endPlannedDate: '2020-10-08T00:00:00.000Z',
    emitterUuid: '110e8400-e29b-11d4-a716-446655440003',
    receivers: [
        {
            userUuid: '110e8400-e29b-11d4-a716-446655440000',
            groupUuid: '256b3672-6d60-11e8-adc0-fa7ae01bbebc',
            permission: 'RW'
        },
        {
            userUuid: '110e8400-e29b-11d4-a716-446655440003',
            groupUuid: '88af50c0-6d5f-11e8-adc0-fa7ae01bbebc',
            permission: 'R'
        }
    ],
    soUuid: [
        'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a'
    ],
    workflows: [
        {
            workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
            parameters: [
                {
                    key: 'smart-object-selected.NAME',
                    source: 'smart-object-selected.NAME'
                }
            ],
            profils: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'technician',
                    login: ''
                },
                {
                    profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    group: 'admin',
                    login: ''
                }
            ]
        }
    ],
    repetitionMode: 'weekly',
    scheduleStatus: 'planned',
    tags: [
        'test'
    ],
    assignedUserUuid: ['110e8400-e29b-11d4-a716-446655440003'],
    activities: [
        {
            beginRealDate: '2019-10-08T01:00:00.000Z',
            endRealDate: '2020-10-08T01:00:00.000Z',
            workflowModelKey: 'test',
            workflowInstanceUuid: '5ae89dac-b37b-4d45-a379-8e2b91dc0acf'
        }
    ],
    source: 'algotech'
};

export const scheduleAdded1: ScheduleDto = {
    scheduleTypeKey: 'Equipement-Type',
    title: 'Maintenance equipement-2',
    creationDate: '2018-10-08T00:00:00.000Z',
    beginPlannedDate: '2018-10-08T00:00:00.000Z',
    endPlannedDate: '2020-10-08T00:00:00.000Z',
    emitterUuid: '110e8400-e29b-11d4-a716-446655440003',
    receivers: [
        {
            userUuid: '110e8400-e29b-11d4-a716-446655440000',
            groupUuid: '256b3672-6d60-11e8-adc0-fa7ae01bbebc',
            permission: 'RW'
        },
        {
            userUuid: '110e8400-e29b-11d4-a716-446655440003',
            groupUuid: '88af50c0-6d5f-11e8-adc0-fa7ae01bbebc',
            permission: 'R'
        }
    ],
    soUuid: [
        'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a'
    ],
    workflows: [
        {
            workflowUuid: 'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
            parameters: [
                {
                    key: 'smart-object-selected.NAME',
                    source: 'smart-object-selected.NAME'
                }
            ],
            profils: [
                {
                    profil: 'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                    group: 'technician',
                    login: ''
                },
                {
                    profil: '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
                    group: 'admin',
                    login: ''
                }
            ]
        }
    ],
    repetitionMode: 'weekly',
    scheduleStatus: 'planned',
    tags: [
        'test'
    ],
    assignedUserUuid: ['110e8400-e29b-11d4-a716-446655440003'],
    activities: [
        {
            beginRealDate: '2019-12-08T01:00:00.000Z',
            endRealDate: '2020-12-08T01:00:00.000Z',
            workflowModelKey: 'test-2',
            workflowInstanceUuid: '16329b5c-c45e-47f9-90c9-810dbf1fc3b0'
        }
    ],
    source: 'DIMO'
};