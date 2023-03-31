import { NotificationDto } from '@algotech-ce/core';

export const notificationTechnicianAndUnread: NotificationDto = {
    uuid: '50d322b8-d162-4f70-9714-0a613a3d50b8',
    title: 'Ma notification (3)',
    content: 'Mon content',
    date: '2019-03-01T18:25:43.511Z',
    additionalInformation: 'step Review',
    icon: 'far fa-file-upload',
    author: 'Marcel Patulacci',
    action: {
        key: 'workflow',
    },
    state: {
        from: 'jsmith',
        to: [
            'grp:technician',
        ],
        read: [],
    },
    channels: [],
};

export const notificationAdminAndRead: NotificationDto = {
    uuid: '50d322b8-d162-4f70-9714-0a613a3d50b9',
    title: 'Ma notification (4)',
    content: 'Mon content',
    date: '2019-04-01T18:25:43.511Z',
    additionalInformation: 'step Review',
    icon: 'far fa-file-upload',
    author: 'Marcel Patulacci',
    action: {
        key: 'workflow',
    },
    state: {
        from: 'jgodrie',
        to: [
            'grp:admin',
        ],
        read: [
            'jsmith',
        ],
    },
    channels: [],
};

export const notificationUserAndUnread: NotificationDto = {
    uuid: '50d322b8-d162-4f70-9714-0a613a3d50b2',
    title: 'Ma notification (5)',
    content: 'Mon content',
    date: '2019-05-01T18:25:43.511Z',
    additionalInformation: 'step Review',
    icon: 'far fa-file-upload',
    author: 'Marcel Patulacci',
    action: {
        key: 'workflow',
    },
    state: {
        from: 'jgodrie',
        to: [
            'usr:jsmith',
        ],
        read: [],
    },
    channels: [],
};

export const notificationUserAndUnreadMobile: NotificationDto = {
    uuid: '50d322b8-d162-4f70-9714-1a613a3d50b2',
    title: 'Ma notification (5)',
    content: 'Mon content',
    date: '2019-01-01T18:25:43.511Z',
    additionalInformation: 'step Review',
    icon: 'far fa-file-upload',
    author: 'Marcel Patulacci',
    action: {
        key: 'workflow',
    },
    state: {
        from: 'jgodrie',
        to: [
            'usr:jsmith',
        ],
        read: [],
    },
    channels: ['mobile'],
};

export const notificationUserAndUnreadWeb: NotificationDto = {
    uuid: '50d322b8-d162-4f70-9714-2a613a3d50b2',
    title: 'Ma notification (5)',
    content: 'Mon content',
    date: '2019-01-01T18:25:43.511Z',
    additionalInformation: 'step Review',
    icon: 'far fa-file-upload',
    author: 'Marcel Patulacci',
    action: {
        key: 'workflow',
    },
    state: {
        from: 'jgodrie',
        to: [
            'usr:jsmith',
        ],
        read: [],
    },
    channels: ['web'],
};

export const notificationUserAndUnreadWebMobile: NotificationDto = {
    uuid: '50d322b8-d162-4f70-9714-3a613a3d50b2',
    title: 'Ma notification (5)',
    content: 'Mon content',
    date: '2019-01-01T18:25:43.511Z',
    additionalInformation: 'step Review',
    icon: 'far fa-file-upload',
    author: 'Marcel Patulacci',
    action: {
        key: 'workflow',
    },
    state: {
        from: 'jgodrie',
        to: [
            'usr:jsmith',
        ],
        read: [],
    },
    channels: ['mobile', 'web'],
};