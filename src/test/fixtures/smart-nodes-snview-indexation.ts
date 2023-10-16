import { SnBox, SnComment, SnFlow, SnGroup, SnModel, SnNode, SnParam, SnSection, SnVersion, SnView } from '../../interfaces';

export const param1: SnParam = {
    id: 'id1',
    key: 'key1',
    displayName: 'displayName1',
    types: 'type1',
    display: 'display1',
    multiple: false,
    pluggable: false,
    master: false,
    required: false,
    hidden: false,
    default: '',
    value: 'value1',
};

export const param2: SnParam = {
    id: 'id2',
    key: 'key2',
    displayName: [{
        lang: 'fr',
        value: 'frVal2'
    },
    {
        lang: 'es',
        value: 'esVal2'
    }],
    types: ['so:type21', 'type22', 'so:', 'so:*'],
    display: 'display2',
    multiple: false,
    pluggable: false,
    master: false,
    required: false,
    hidden: false,
    default: '',
    value: 5,
};

export const param3: SnParam = {
    id: 'id3',
    key: 'key3',
    displayName: [{
        lang: 'fr',
        value: 'frVal3'
    },
    {
        lang: 'es',
        value: 'esVal3'
    }],
    types: ['type31', 'so:type32'],
    display: 'display3',
    multiple: false,
    pluggable: false,
    master: false,
    required: false,
    hidden: false,
    default: '',
    value: '',
};

export const param4: SnParam = {
    id: 'id4',
    key: 'key4',
    displayName: [{
        lang: 'fr',
        value: 'frVal4'
    },
    {
        lang: 'es',
        value: 'esVal4'
    }],
    types: ['type41', 'type42'],
    display: 'display4',
    multiple: false,
    pluggable: false,
    master: false,
    required: false,
    hidden: false,
    default: '',
    value: '',
};

export const param5: SnParam = {
    id: 'id5',
    key: 'key5',
    displayName: [{
        lang: 'fr',
        value: 'frVal5'
    },
    {
        lang: 'es',
        value: 'esVal5'
    }],
    types: ['type51', 'so:type52'],
    display: 'display5',
    multiple: false,
    pluggable: false,
    master: false,
    required: false,
    hidden: false,
    default: '',
    value: '',
};

export const param6: SnParam = {
    id: 'id6',
    key: 'key6',
    displayName: [{
        lang: 'fr',
        value: 'frVal6'
    },
    {
        lang: 'es',
        value: 'esVal6'
    }],
    types: ['type61', 'type62'],
    display: 'display6',
    multiple: false,
    pluggable: false,
    master: false,
    required: false,
    hidden: false,
    default: '',
    value: '',
};

export const param7: SnParam = {
    id: 'id7',
    key: 'key7',
    displayName: [{
        lang: 'fr',
        value: 'frVal7'
    },
    {
        lang: 'es',
        value: 'esVal7'
    }],
    types: ['type71', 'type72'],
    display: 'display7',
    multiple: false,
    pluggable: false,
    master: false,
    required: false,
    hidden: false,
    default: '',
    value: '',
};

export const flow1: SnFlow = {
    id: 'idFlow1',
    key: 'keyFlow1',
    displayName: [{
        lang: 'fr',
        value: 'frFlow1'
    },
    {
        lang: 'es',
        value: 'esFlow1'
    }],
    paramsEditable: true,
    params: [param3]
}

export const flow2: SnFlow = {
    id: 'idFlow2',
    key: 'keyFlow2',
    displayName: [{
        lang: 'fr',
        value: 'frFlow2'
    },
    {
        lang: 'es',
        value: 'esFlow2'
    }],
    paramsEditable: false,
    params: [param4]
}

export const flow3: SnFlow = {
    id: 'idFlow3',
    key: 'keyFlow3',
    displayName: [{
        lang: 'fr',
        value: 'frFlow3'
    },
    {
        lang: 'es',
        value: 'esFlow3'
    }],
    paramsEditable: false,
    params: []
}

export const section1: SnSection = {
    id: 'idsection1',
    key: 'keysection1',
    displayName: [{
        lang: 'fr',
        value: 'frsection1'
    },
    {
        lang: 'es',
        value: 'essection1'
    }],
    editable: true,
    open: true,
    hidden: false,
    params: [param5]
}

export const section2: SnSection = {
    id: 'idsection2',
    key: 'keysection2',
    displayName: [{
        lang: 'fr',
        value: 'frsection2'
    },
    {
        lang: 'es',
        value: 'essection2'
    }],
    editable: false,
    open: true,
    hidden: false,
    params: [param6]
}

export const section3: SnSection = {
    id: 'idFlow3',
    key: 'keyFlow3',
    displayName: [{
        lang: 'fr',
        value: 'frFlow3'
    },
    {
        lang: 'es',
        value: 'esFlow3'
    }],
    editable: false,
    open: true,
    hidden: false,
    params: []
}

export const node1: SnNode = {
    id: 'id1',
    displayName: [{
        lang: 'fr',
        value: 'frNode1'
    },
    {
        lang: 'es',
        value: 'esNode1'
    }],
    open: true,
    canvas: { x: 0, y: 0 },
    custom: {},
    key: 'nodeKey1',
    parentId: 'nodeParent1',
    icon: 'nodeIcon1',
    type: 'nodeType1',
    flowsEditable: true,
    flows: [flow1, flow2],
    params: [param1, param2],
    sections: [section1, section2],
    expanded: true,
};

export const node2: SnNode = {
    id: 'id1',
    displayName: [{
        lang: 'fr',
        value: 'frNode2'
    },
    {
        lang: 'es',
        value: 'esNode2'
    }],
    open: true,
    canvas: { x: 0, y: 0 },
    custom: {},
    key: 'nodeKey2',
    parentId: 'nodeParent2',
    icon: 'nodeIcon2',
    type: 'nodeType2',
    flowsEditable: true,
    flows: [flow3],
    params: [param7],
    sections: [section3],
    expanded: true,
};

export const node3: SnNode = {
    id: 'idNode3',
    type: 'SnConnectorNode',
    canvas: {
        x: 0,
        y: 0
    },
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Appeler un smartflow'
        },
        {
            lang: 'en-US',
            value: 'Call a smartflow'
        },
        {
            lang: 'es-ES',
            value: 'LLamar a un smartflow'
        }
    ],
    icon: 'fa-solid fa-atom',
    open: true,
    flows: [
        {
            direction: 'in',
            params: [],
            id: 'dd7705ef-72ae-6a2c-f3c7-3215af2d8d6f'
        },
        {
            key: 'done',
            direction: 'out',
            paramsEditable: true,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Succès'
                },
                {
                    lang: 'en-US',
                    value: 'Success'
                },
                {
                    lang: 'es-ES',
                    value: 'Fin correcto'
                }
            ],
            params: [
                {
                    direction: 'out',
                    types: 'so:typeSoNode3',
                    pluggable: true,
                    display: 'key-edit',
                    id: 'd529d4ea-3a98-43dc-1c5a-4a2a841346b0',
                    key: '',
                    multiple: true,
                    value: null
                }
            ],
            id: 'b9d96250-6b43-d28e-54d8-71d249bc7d13',
            toward: '566b825f-0cb5-a16e-31be-1ddf25e0a1dd'
        },
        {
            key: 'error',
            direction: 'out',
            paramsEditable: true,
            displayName: [
                {
                    lang: 'fr-FR',
                    value: 'Erreur'
                },
                {
                    lang: 'en-US',
                    value: 'Error'
                },
                {
                    lang: 'es-ES',
                    value: 'Error'
                }
            ],
            params: [
                {
                    direction: 'out',
                    types: 'number',
                    pluggable: true,
                    display: 'key-edit',
                    id: 'b9ef3dc8-6d76-51eb-b2c8-acb3d9acd687',
                    key: '',
                    multiple: false,
                    value: null
                },
                {
                    direction: 'out',
                    types: [
                        'string',
                        'object'
                    ],
                    pluggable: true,
                    display: 'key-edit',
                    id: '4db40e98-eafb-458b-0b62-4ef81144de9b',
                    key: '',
                    multiple: false,
                    value: null
                }
            ],
            id: 'idNode3'
        }
    ],
    params: [
        {
            key: 'smartFlow',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-CONNECTOR-SMARTFLOW',
            pluggable: false,
            display: 'select',
            required: true,
            id: '0973e4e0-7cf9-629b-8d77-e33160fe016d',
            value: 'smartflow1'
        },
        {
            key: 'runOutside',
            direction: 'in',
            types: 'boolean',
            multiple: false,
            displayName: 'SN-CONNECTOR-RUN-OUTSIDE',
            pluggable: true,
            required: true,
            display: 'input',
            default: false,
            id: '',
            value: false
        }
    ],
    sections: [
        {
            key: 'inputs',
            displayName: 'SN-CONNECTOR-INPUTS',
            open: true,
            editable: true,
            params: [],
            id: '',
            hidden: true
        }
    ],
}

export const node4: SnNode = {
    id: 'idNode4',
    type: 'SnSubWorkflowNode',
    canvas: {
        x: 0,
        y: 0
    },
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Appeler un workflow'
        },
        {
            lang: 'en-US',
            value: 'Call a workflow'
        },
        {
            lang: 'es-ES',
            value: 'LLamar a un workflow'
        }
    ],
    icon: 'fa-solid fa-diagram-project',
    open: true,
    flows: [
        {
            direction: 'in',
            params: [

            ],
            id: ''
        },
        {
            key: 'done',
            direction: 'out',
            paramsEditable: true,
            params: [
                {
                    direction: 'out',
                    types: 'so:typeSoNode4',
                    multiple: false,
                    pluggable: true,
                    display: 'key-edit',
                    id: '',
                    value: 'date_edition',
                    hidden: false
                }
            ],
            id: ''
        }
    ],
    params: [
        {
            key: 'workFlow',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-SUB-WORKFLOW.SELECT',
            pluggable: false,
            display: 'select',
            required: true,
            id: '',
            value: 'workflow1'
        }
    ],
    sections: [
        {
            key: 'inputs',
            displayName: 'SN-SUB-WORKFLOW.INPUTS',
            open: true,
            editable: true,
            hidden: true,
            params: [

            ],
            id: ''
        },
        {
            key: 'profiles',
            displayName: 'SN-SUB-WORKFLOW.PROFILES',
            open: true,
            editable: true,
            hidden: false,
            params: [
                {
                    id: '',
                    direction: 'in',
                    key: 'valoche',
                    types: 'string',
                    multiple: false,
                    pluggable: false,
                    display: 'select',
                    required: false,
                    value: null
                },
                {
                    id: '',
                    direction: 'in',
                    key: 'pascal',
                    types: 'string',
                    multiple: false,
                    pluggable: false,
                    display: 'select',
                    required: false,
                    value: null
                }
            ],
            id: ''
        }
    ],
    custom: {
        taskKey: 'TaskSubWorkflow'
    }
};

export const reportNode: SnNode = {
    id: 'reportNodeId',
    type: 'SnxReportNode',
    canvas: {
        x: 1339.6851133157807,
        y: 299.5889887340775
    },
    displayName: [
        {
            lang: 'fr-FR',
            value: 'Créer un rapport'
        }
    ],
    icon: 'fad fa-file-alt',
    open: true,
    flows: [
        {
            id: '71659022-4251-f0ba-6724-e9df084c0e04',
            direction: 'in',
            params: []
        },
        {
            key: 'done',
            direction: 'out',
            paramsEditable: true,
            params: [
                {
                    direction: 'out',
                    types: 'sys:file',
                    pluggable: true,
                    display: 'key-edit',
                    multiple: false,
                    id: 'e87060c7-fc37-604b-0436-7a75bc6e57b0',
                    key: '',
                    value: null
                }
            ],
            id: '2a647e7c-3391-9278-7075-d971c482cd13',
            toward: 'b4f557f2-4ec7-25c3-87fa-2eb86da75361'
        }
    ],
    params: [
        {
            key: 'report',
            direction: 'in',
            types: 'string',
            displayName: 'SN-REPORT-REPORT',
            pluggable: false,
            display: 'select',
            required: true,
            id: '3bc2a8dd-fdca-fd32-528c-56c199dd28e2',
            multiple: false,
            value: 'nomenclat'
        },
        {
            key: 'fileId',
            direction: 'in',
            types: 'string',
            displayName: 'SN-REPORT-REPORT',
            pluggable: false,
            display: 'input',
            required: false,
            value: '5e944a80-5dec-0fea-c564-5521694dfdd2',
            id: 'af6f6f18-c2ae-8e86-a982-c70911ad4ef7',
            multiple: false
        },
        {
            key: 'templateName',
            direction: 'in',
            types: 'string',
            displayName: 'SN-REPORT-REPORT',
            pluggable: false,
            display: 'input',
            required: false,
            value: 'Template rapport nomenclat.xlsx',
            id: 'f68c9e97-d4bf-f479-8924-e24119341f2b',
            multiple: false
        },
        {
            key: 'keysTypes',
            direction: 'in',
            types: 'string',
            displayName: 'SN-REPORT-REPORT',
            pluggable: false,
            display: 'input',
            required: false,
            id: 'b36186c5-cab3-36f6-9abd-71f1712f4a54',
            multiple: false,
            value: [
                {
                    uuid: '',
                    key: 'nomenclat',
                    type: 'so:nomenclat',
                    multiple: true,
                    required: true,
                    isPrimitve: false
                }
            ]
        }
    ],
    sections: [
        {
            key: 'inputs',
            displayName: 'SN-REPORT-INPUTS',
            editable: true,
            open: true,
            hidden: false,
            params: [
                {
                    id: 'da3ba924-f4a8-d840-4a0a-1e4513872400',
                    direction: 'in',
                    key: 'nomenclat',
                    toward: '875da656-3f4e-1c18-c578-b403ca91da09',
                    types: 'so:nomenclat',
                    multiple: true,
                    pluggable: true,
                    display: 'input',
                    value: null
                }
            ],
            id: '392b507f-1d79-7f6d-e5fa-08fa8abe6f94',
        },
        {
            key: 'properties',
            displayName: 'SN-NODE-PROPERTIES',
            editable: false,
            open: true,
            hidden: false,
            params: [
                {
                    key: 'fileName',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-REPORT-FILENAME',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    id: '67695f35-685e-4429-9de9-a8d49c72bcb9',
                    value: 'rapport Nomenclat'
                },
                {
                    key: 'download',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-REPORT-DOWNLOAD',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false,
                    id: 'b1f77463-5560-e52f-89e9-5cf78b1f0cbb',
                    value: true
                }
            ],
            id: '2604e4c7-6a4c-8f0f-a9a1-b557ac64f9ee'
        },
        {
            key: 'save',
            displayName: 'SN-NODE-SAVE',
            editable: false,
            open: true,
            hidden: false,
            params: [
                {
                    key: 'generate',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-REPORT-GENERATE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false,
                    id: 'bfadeae4-2b63-281d-0f5c-d852dfac608d',
                    value: false
                },
                {
                    key: 'object',
                    direction: 'in',
                    types: 'sk:atDocument',
                    displayName: 'SN-NODE-OBJECT',
                    pluggable: true,
                    required: false,
                    multiple: false,
                    id: 'fad89b95-976e-da58-0b94-8245265a363f',
                    value: null
                },
                {
                    key: 'version',
                    direction: 'in',
                    types: 'sys:file',
                    multiple: false,
                    displayName: 'SN-REPORT-VERSION',
                    pluggable: true,
                    required: false,
                    id: 'b5cb9d12-6c21-a2f1-159f-1a7ca2cc108c',
                    value: null
                }
            ],
            id: '6fdc1d26-3810-0833-8104-f3179835a501'
        }
    ],
    custom: {
        taskKey: 'TaskXReport'
    }
}

export const param1Tokens: string = 'value1¤type1¤';
export const param2Tokens: string = '5¤so:type21¤type22¤so:¤so:*¤frVal2¤esVal2¤';
export const param3Tokens: string = 'key3¤type31¤so:type32¤frVal3¤esVal3¤';
export const param4Tokens: string = 'type41¤type42¤frVal4¤esVal4¤';
export const param5Tokens: string = '¤key5¤type51¤so:type52¤frVal5¤esVal5¤';
export const param6Tokens: string = 'type61¤type62¤frVal6¤esVal6¤';
export const param7Tokens: string = 'type71¤type72¤frVal7¤esVal7¤';
export const node1displayTokens: string = 'frNode1¤esNode1¤';
export const node2displayTokens: string = '¤frNode2¤esNode2¤';
export const snNode1Tokens = `${param5Tokens}${param6Tokens}${node1displayTokens}${param1Tokens}${param2Tokens}${param3Tokens}${param4Tokens}`
export const snNode2Tokens = `${node2displayTokens}${param7Tokens}`

export const group1: SnGroup = {
    id: 'idgroup1',
    displayName: [{
        lang: 'fr',
        value: 'frgroup1'
    },
    {
        lang: 'es',
        value: 'esgroup1'
    }],
    open: true,
    canvas: { x: 0, y: 0 },
    color: ''
}

export const group2: SnGroup = {
    id: 'idgroup2',
    displayName: 'esgroup2',
    open: true,
    canvas: { x: 0, y: 0 },
    color: ''
}

export const box1: SnBox = {
    id: 'idSnBox1',
    displayName: [{
        lang: 'fr',
        value: 'frBox1'
    },
    {
        lang: 'es',
        value: 'esBox1'
    }],
    open: true,
    canvas: { x: 0, y: 0 },
}

export const box2: SnBox = {
    id: 'idSnBox2',
    displayName: 'esBox2',
    open: true,
    canvas: { x: 0, y: 0 },
}

export const comment1: SnComment = {
    id: 'idcomment1',
    parentId: '',
    open: true,
    comment: [{
        lang: 'fr',
        value: 'frcomment1'
    },
    {
        lang: 'es',
        value: 'escomment1'
    }],
    canvas: { x: 0, y: 0 },
}

export const comment2: SnComment = {
    id: 'idcomment2',
    parentId: '',
    open: true,
    comment: 'escomment2',
    canvas: { x: 0, y: 0 },
}

export const comment3: SnComment = {
    id: 'idcomment3',
    parentId: '',
    open: true,
    comment: 'escomment3',
    canvas: { x: 0, y: 0 },
}

export const view1: SnView = {
    id: 'view1Id',
    groups: [group1, group2],
    box: [box1, box2],
    nodes: [node1],
    comments: [comment1, comment2],
    drawing: {
        lines: [],
        elements: []
    },
    options: {
        tags: ['tag1', 'tag2'],
        variables: [{ key: 'varKey1', value: 'val1', type: 'so:varType1' }, { key: 'varKey2', type: 'varType2' }],
        profiles: [{ key: 'profile1', name: 'profileName1' }],
        api: {
            route: 'route1',
            type: 'GET',
            summary: 'apiSummury',
            description: 'apiDescription'
        }
    },
};

export const view2: SnView = {
    id: 'view2Id',
    groups: [],
    box: [],
    nodes: [node1, node2],
    comments: [comment3],
    drawing: {
        lines: [],
        elements: []
    },
    options: {
        tags: [],
        variables: [],
        profiles: [],
        api: {}
    },
};

export const view3: SnView = {
    id: 'view2Id',
    groups: [],
    box: [],
    nodes: [node3, node4, reportNode],
    comments: [],
    drawing: {
        lines: [],
        elements: []
    },
};

export const view4: SnView = {
    id: 'view2Id',
    groups: [],
    box: [],
    nodes: [node2],
    comments: [],
    drawing: {
        lines: [],
        elements: []
    },
    options: {
    },
};

export const version1: SnVersion = {
    uuid: 'snVersionUuid',
    createdDate: '12/12/2012',
    updatedDate: '12/12/2012',
    creatorUuid: 'uuid',
    deleted: false,
    view: view1
}

export const version2: SnVersion = {
    uuid: 'snVersionUuid',
    createdDate: '12/12/2012',
    updatedDate: '12/12/2012',
    creatorUuid: 'uuid',
    deleted: false,
    view: view2
}

export const version3: SnVersion = {
    uuid: 'snVersionUuid',
    createdDate: '12/12/2012',
    updatedDate: '12/12/2012',
    creatorUuid: 'uuid',
    deleted: false,
    view: view3
}

export const model: SnModel = {
    uuid: 'Modeluuid',
    customerKey: 'customerKey',
    deleted: false,
    createdDate: '12/12/2012',
    updateDate: '12/12/2012',
    key: 'model1',
    displayName: [{
        lang: 'fr',
        value: 'frModel1'
    },
    {
        lang: 'es',
        value: 'esModel1'
    }],
    type: '',
    versions: [version1, version2],
}

export const group1Tokens = `¤frgroup1¤esgroup1¤`;
export const group2Tokens = `¤esgroup2¤`;
export const box1Tokens = `¤frBox1¤esBox1¤`;
export const box2Tokens = `¤esBox2¤`;
const view1DisplayTokens = `¤model1¤frModel1¤esModel1¤`;
const view2DisplayTokens = `¤model1¤frModel1¤esModel1¤`;
export const comment1Tokens: string = '¤frcomment1¤escomment1¤';
export const comment2Tokens: string = '¤escomment2¤';
export const comment3Tokens: string = '¤escomment3¤';
export const view1optionsTokens: string = 'tag1¤tag2¤varKey1¤so:varType1¤varKey2¤varType2¤profileName1¤route1¤GET¤apiSummury¤apiDescription¤';
export const view1Tokens = `${view1DisplayTokens}${view1optionsTokens}`
export const view2Tokens = `${view2DisplayTokens}`
export const view3Tokens = `${view2DisplayTokens}`
export const view4Tokens = `${view2DisplayTokens}`

export const box1ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: box1.id,
    updateDate: model.updateDate,
    displayName: box1.displayName,
    connectedTo: [],
    type: 'box',
    texts: box1Tokens
}

export const box2ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: box2.id,
    updateDate: model.updateDate,
    displayName: box2.displayName,
    connectedTo: [],
    type: 'box',
    texts: box2Tokens
};

export const comment1ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: comment1.id,
    updateDate: model.updateDate,
    displayName: comment1.comment,
    connectedTo: [],
    type: 'comment',
    texts: comment1Tokens
};

export const comment2ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: comment2.id,
    updateDate: model.updateDate,
    displayName: comment2.comment,
    connectedTo: [],
    type: 'comment',
    texts: comment2Tokens
};

export const group1ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: group1.id,
    updateDate: model.updateDate,
    displayName: group1.displayName,
    connectedTo: [],
    type: 'group',
    texts: group1Tokens
};


export const group2ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: group2.id,
    updateDate: model.updateDate,
    displayName: group2.displayName,
    connectedTo: [],
    type: 'group',
    texts: group2Tokens
};

export const view1ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: '',
    updateDate: model.updateDate,
    displayName: model.displayName,
    connectedTo: ['so:varType1'],
    type: 'view',
    texts: view1Tokens
};

export const view3ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version3.uuid,
    snViewUuid: version3.view.id,
    elementUuid: '',
    updateDate: model.updateDate,
    displayName: model.displayName,
    connectedTo: [],
    type: 'view',
    texts: '¤model1¤frModel1¤esModel1¤'
};

export const node1ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version1.uuid,
    snViewUuid: version1.view.id,
    elementUuid: (version1.view as SnView).nodes[0].id,
    updateDate: model.updateDate,
    displayName: node1.displayName,
    connectedTo: ['so:type52', 'so:type21', 'so:type32'],
    type: 'node',
    texts: snNode1Tokens
};

export const node2ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version2.uuid,
    snViewUuid: version2.view.id,
    updateDate: model.updateDate,
    displayName: node2.displayName,
    elementUuid: node2.id,
    connectedTo: [],
    type: 'node',
    texts: snNode2Tokens
};

export const node3ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version3.uuid,
    snViewUuid: version3.view.id,
    elementUuid: 'idNode3',
    updateDate: model.updateDate,
    displayName: node3.displayName,
    connectedTo: ['sf:smartflow1', 'so:typeSoNode3'],
    type: 'node',
    texts: '¤Appeler un smartflow¤Call a smartflow¤LLamar a un smartflow¤smartflow1¤string¤false¤boolean¤so:typeSoNode3¤number¤string¤object¤'
};

export const node4ToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version3.uuid,
    snViewUuid: version3.view.id,
    elementUuid: 'idNode4',
    updateDate: model.updateDate,
    displayName: node4.displayName,
    connectedTo: ['wf:workflow1', 'so:typeSoNode4'],
    type: 'node',
    texts: '¤valoche¤string¤pascal¤string¤Appeler un workflow¤Call a workflow¤LLamar a un workflow¤workflow1¤string¤date_edition¤so:typeSoNode4¤'
};

export const reportNodeToIndex = {
    key: model.key,
    snModelUuid: model.uuid,
    snVersionUuid: version3.uuid,
    snViewUuid: version3.view.id,
    elementUuid: reportNode.id,
    updateDate: model.updateDate,
    displayName: reportNode.displayName,
    connectedTo: ['so:nomenclat', 'report:nomenclat'],
    type: 'node',
    texts: '¤nomenclat¤so:nomenclat¤rapport Nomenclat¤string¤true¤boolean¤false¤boolean¤sk:atDocument¤sys:file¤Créer un rapport¤nomenclat¤string¤string¤Template rapport nomenclat.xlsx¤string¤string¤sys:file¤'
};


