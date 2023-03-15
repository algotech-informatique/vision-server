import { SnModel } from '../../interfaces';
import moment from 'moment';
import { UUID } from 'angular2-uuid';

export class DefaultSmartNodes {

    public static defaultSmartNodes: SnModel = {
        createdDate: '',
        updateDate: '',
        customerKey: '',
        deleted: false,
        displayName: [],
        dirUuid: '',
        key: 'smartmodel',
        type: 'smartmodel',
        uuid: '',
        versions: [{
            uuid: UUID.UUID(),
            createdDate: moment().format(),
            creatorUuid: 'auto',
            deleted: false,
            updatedDate: moment().format(),
            view: {
                id: UUID.UUID(),
                groups: [],
                nodes: [],
                box: [],
                comments: [],
                options: {
                    type: 'smartmodel',
                },
                drawing: {
                    elements: [],
                    lines: [],
                },
            },
        }],
    };

}