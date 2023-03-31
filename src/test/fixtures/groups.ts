import { GroupDto } from '@algotech-ce/core';
import { CustomerInit } from 'interfaces';

export const group1: GroupDto = {
    "application": {
        "authorized": [],
        "default": {
            "mobile": "",
            "web": ""
        }
    },
    "description": "",
    "key": "admin",
    "name": "Admin",
    "uuid": "5f1906d3-7a1c-4310-9344-02aac259c77d"
};
export const group2: GroupDto = {
    "application": {
        "authorized": [],
        "default": {
            "mobile": "",
            "web": ""
        }
    },
    "description": "",
    "key": "plan-editor",
    "name": "Plan-Editeur",
    "uuid": "9cd431f4-f67c-4306-aa53-e64d46bff122"
};
export const group3: GroupDto = {
    "application": {
        "authorized": [],
        "default": {
            "mobile": "",
            "web": ""
        }
    },
    "description": "",
    "key": "process-manager",
    "name": "Process Manager",
    "uuid": "07e27ea5-a280-453c-adef-122444c3d71c"
};
export const group4: GroupDto = {
    "application": {
        "authorized": [],
        "default": {
            "mobile": "",
            "web": ""
        }
    },
    "description": "",
    "key": "sadmin",
    "name": "Admin Editeur",
    "uuid": "739b1ffc-38e3-4729-baab-4ad85bd81924"
};
export const group5: GroupDto = {
    "application": {
        "authorized": [],
        "default": {
            "mobile": "",
            "web": ""
        }
    },
    "description": "",
    "key": "viewer",
    "name": "Viewer",
    "uuid": "696f3f8f-1948-45c8-b459-569a2617687f"
};

export const createGroup: GroupDto = {
    uuid: '0b7f2465-aeab-4e30-8182-ba331ffc88dd',
    key: 'test-group',
    name: 'Test group',
    description: 'Groupe des Test (création)',
    application: {
        authorized: ['test-page'],
        default: {
            web: 'test-page',
            mobile: '',
        },
    },
};

export const updateGroup: GroupDto = {
    uuid: '0b7f2465-aeab-4e30-8182-ba331ffc88dd',
    key: 'test-group',
    name: 'Test group',
    description: 'Groupe des Test (updated)',
    application: {
        authorized: ['test-page', 'test-updated'],
        default: {
            web: 'test-page',
            mobile: '',
        },
    },
};

export const customer: CustomerInit = {
    customerKey: 'nouveau',
    name: 'new-customer',
    login: 'newCust',
    email: 'abc@abc.com',
    password: '123456',
    languages: [{
        lang: 'fr',
        value: 'fr-FR',
    }],
};

