import { ScheduleSearchDto } from '@algotech/core';

export const scheduleSearchAllOptions: ScheduleSearchDto = {
    scheduleTypeKey: [
        'Equipement-Type', 'Equipement-Type-1'
    ],
    title: [
        'Maintenance equipement', 'Maintenance equipement-1',
        'Maintenance equipement-2'
    ],
    creationDate: [
        {
            start: '2018-10-08T00:00:00.000Z',
            end: '2018-10-08T00:00:00.000Z',
        },
        {
            start: '2019-10-08T00:00:00.000Z',
            end: '2019-10-08T01:01:00.000Z',
        },
    ],
    beginPlannedDate: [
        {
            start: '2018-10-08T00:00:00.000Z',
            end: '2018-10-08T00:00:00.000Z',
        },
        {
            start: '2019-10-08T00:00:00.000Z',
            end: '2019-10-08T01:01:00.000Z',
        },
    ],
    endPlannedDate: [
        {
            start: '2020-10-08T00:00:00.000Z',
            end: '2020-10-08T00:00:00.000Z',
        },
        {
            start: '2021-10-08T00:00:00.000Z',
            end: '2021-10-08T01:00:00.000Z',
        },
    ],
    emitterUuid: [
        '110e8400-e29b-11d4-a716-446655440003',
    ],
    receivers: {
        userUuid: [
            '110e8400-e29b-11d4-a716-446655440000',
            '110e8400-e29b-11d4-a716-446655440003',
        ],
        groupUuid: [
            '256b3672-6d60-11e8-adc0-fa7ae01bbebc',
            '88af50c0-6d5f-11e8-adc0-fa7ae01bbebc',
        ],
        permission: [
            'RW',
            'R',
        ],
    },
    soUuid: [
        'a14dc702-9a0e-46ec-bc1f-5adfd3ff7e4a',
    ],
    workflows: {
        workflowUuid: [
            'cfee7093-13ba-a88b-a0a2-24fe55c0a647',
        ],
        parameters: {
            key: [
                'smart-object-selected.NAME',
            ],
            source: [
                'smart-object-selected.NAME',
            ],
        },
        profils: {
            profil: [
                'f57fec2c-1d8c-11e9-ab14-d663bd873d93',
                '35a5ffe4-1d8d-11e9-ab14-d663bd873d93',
            ],
            group: [
                'technician',
                'admin',
            ],
            login: [
                '',
            ],
        },
    },
    repetitionMode: [
        'weekly',
    ],
    scheduleStatus: {
        key: [
            'planned',
        ],
    },
    tags: [
        'test',
    ],
    assignedUserUuid: [
        '110e8400-e29b-11d4-a716-446655440003',
    ],
    activities: {
        beginRealDate: [
            {
                start: '2019-10-08T00:00:00.000Z',
                end: '2019-10-08T01:00:00.000Z',
            },
            {
                start: '2019-12-08T01:00:00.000Z',
                end: '2020-12-08T01:00:00.000Z',
            },
        ],
        endRealDate: [
            {
                start: '2020-10-08T01:00:00.000Z',
                end: '2020-10-08T01:00:00.000Z',
            },
        ],
        workflowModelKey: ['test', 'test-2'],
        workflowInstanceUuid: [
            '35a5ffe4-1d8d-11e9-ab14-r569bd873d93',
            '5ae89dac-b37b-4d45-a379-8e2b91dc0acf',
            '16329b5c-c45e-47f9-90c9-810dbf1fc3b0'
        ],
    },
    source: [
        'algotech', 'DIMO'
    ],
};