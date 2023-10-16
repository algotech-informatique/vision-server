import { Lang } from "../../interfaces";
import { SmartNodesService, SnIndexationUtils } from "../../providers";


describe(SnIndexationUtils.name, () => {

    describe(SnIndexationUtils._createSnSynopticSearch.name, () => {
        it('should create a page SnSynopticSearch', () => {
            expect(SnIndexationUtils._createSnSynopticSearch(
                'key',
                'snModelUuid',
                'snVersionUuid',
                'snViewUuid',
                'elementUuid',
                '12/12/1212',
                '',      
                ['link1', 'link2'],
                'texts',
                'page'
            )).toMatchObject({
                key: 'key',
                snModelUuid: 'snModelUuid',
                snVersionUuid: 'snVersionUuid',
                snViewUuid: 'snViewUuid',
                elementUuid: 'elementUuid',
                updateDate: '12/12/1212',
                displayName: '',
                connectedTo: ['link1', 'link2'],
                texts: 'texts',
                type: 'page',
            });

        });

        it('should create a widget SnSynopticSearch', () => {
            expect(SnIndexationUtils._createSnSynopticSearch(
                'key',
                'snModelUuid',
                'snVersionUuid',
                'snViewUuid',
                'elementUuid',
                '12/12/1212',
                'stringDisplay',
                [],
                'texts',
                'widget'
            )).toMatchObject({
                key: 'key',
                snModelUuid: 'snModelUuid',
                snVersionUuid: 'snVersionUuid',
                snViewUuid: 'snViewUuid',
                elementUuid: 'elementUuid',
                updateDate: '12/12/1212',
                displayName: 'stringDisplay',
                connectedTo: [],
                texts: 'texts',
                type: 'widget',
            });
        });

        it('should create a app SnSynopticSearch', () => {
            expect(SnIndexationUtils._createSnSynopticSearch(
                'key',
                'snModelUuid',
                'snVersionUuid',
                'snViewUuid',
                'elementUuid',
                '12/12/1212',
                [{ lang: 'fr', value: 'frLangDisplay' }, { lang: 'es', value: 'esLangDisplay' }],
                ['link1', 'link2'],
                'texts',
                'app',
            )).toMatchObject({
                key: 'key',
                snModelUuid: 'snModelUuid',
                snViewUuid: 'snViewUuid',
                snVersionUuid: 'snVersionUuid',
                elementUuid: 'elementUuid',
                updateDate: '12/12/1212',
                displayName: [{ lang: 'fr', value: 'frLangDisplay' }, { lang: 'es', value: 'esLangDisplay' }],
                connectedTo: ['link1', 'link2'],
                texts: 'texts',
                type: 'app',
            });
        });

        it('should create a node SnSynopticSearch', () => {
            expect(SnIndexationUtils._createSnSynopticSearch(
                'key',
                'snModelUuid',
                'snVersionUuid',
                'snViewUuid',
                'elementUuid',
                '12/12/1212',
                'stringDisplay',
                ['link1', 'link2'],
                'texts',
                'node'
            )).toMatchObject({
                key: 'key',
                snModelUuid: 'snModelUuid',
                snVersionUuid: 'snVersionUuid',
                snViewUuid: 'snViewUuid',
                elementUuid: 'elementUuid',
                updateDate: '12/12/1212',
                displayName: 'stringDisplay',
                connectedTo: ['link1', 'link2'],
                texts: 'texts',
                type: 'node',
            });

        });

        it('should create a view SnSynopticSearch', () => {
            expect(SnIndexationUtils._createSnSynopticSearch(
                'key',
                'snModelUuid',
                'snVersionUuid',
                'snViewUuid',
                'elementUuid',
                '12/12/1212',
                [{ lang: 'fr', value: 'frLangDisplay' }, { lang: 'es', value: 'esLangDisplay' }],
                [],
                'texts',
                'view'
            )).toMatchObject({
                key: 'key',
                snModelUuid: 'snModelUuid',
                snVersionUuid: 'snVersionUuid',
                snViewUuid: 'snViewUuid',
                elementUuid: 'elementUuid',
                updateDate: '12/12/1212',
                displayName: [{ lang: 'fr', value: 'frLangDisplay' }, { lang: 'es', value: 'esLangDisplay' }],
                connectedTo: [],
                texts: 'texts',
                type: 'view',
            });
        });

        it('should create a report SnSynopticSearch', () => {
            expect(SnIndexationUtils._createSnSynopticSearch(
                'key',
                'snModelUuid',
                'snVersionUuid',
                'snViewUuid',
                'elementUuid',
                '12/12/1212',
                [{ lang: 'fr', value: 'frLangDisplay' }, { lang: 'es', value: 'esLangDisplay' }],
                [],
                'texts',
                'report'
            )).toMatchObject({
                key: 'key',
                snModelUuid: 'snModelUuid',
                snVersionUuid: 'snVersionUuid',
                snViewUuid: 'snViewUuid',
                elementUuid: 'elementUuid',
                updateDate: '12/12/1212',
                displayName: [{ lang: 'fr', value: 'frLangDisplay' }, { lang: 'es', value: 'esLangDisplay' }],
                connectedTo: [],
                texts: 'texts',
                type: 'report',
            });
        });
    });


    describe(SnIndexationUtils.isUuid.name, () => {
        it('should check if a string is Uuid', () => {            
            expect(SnIndexationUtils.isUuid('b6b4451e-a90b-3649-406b-b1b5b6f4dddc')).toEqual(true)
        });        

        it('should check if a string is not Uuid', () => {            
            expect(SnIndexationUtils.isUuid('notUuid')).toEqual(false)
        }); 

        it('should check if a number is not Uuid', () => {            
            expect(SnIndexationUtils.isUuid(5)).toEqual(false)
        }); 

        it('should check if a boolean is not Uuid', () => {            
            expect(SnIndexationUtils.isUuid(false)).toEqual(false)
        }); 

        it('should check if a object is not Uuid', () => {            
            expect(SnIndexationUtils.isUuid({ key: 'I am not an uuid'})).toEqual(false)
        }); 
    });

    describe(SnIndexationUtils.indexLang.name, () => {
        it('should indexLang with ¤ at the start', () => {
            let display: Lang[] = [{
                lang: 'fr',
                value: 'frVal'
            },
            {
                lang: 'es',
                value: 'esVal'
            },
            {
                lang: 'en',
                value: 'enVal'
            }];

            expect(SnIndexationUtils.indexLang(display, SmartNodesService.SEARCH_SEPARATOR)).toEqual('¤frVal¤esVal¤enVal¤')
        });

        it('should indexLang with "" at the start', () => {
            let display: Lang[] = [{
                lang: 'fr',
                value: 'teste'
            },
            {
                lang: 'es',
                value: 'testo'
            },
            {
                lang: 'en',
                value: 'test'
            },
            {
                lang: 'ar',
                value: ''
            }];

            expect(SnIndexationUtils.indexLang(display, '')).toEqual('teste¤testo¤test¤')
        });
    });

    describe(SnIndexationUtils.indexProperties.name, () => {
        it('should index given object properties', () => {
            let object = {
                key1: 'value',
                key2: 1,
                key3: true,
                arrayKey1: ['value1', 'value2'],
                arrayKey2: [3, 4],
                arrayKey3: [false, false],
                Objectsarray:[ { key: 'value'}],
                emptyVal: '',
            };

            expect(SnIndexationUtils.indexProperties(object, [
                'key1',
                'key2',
                'key3',
                'arrayKey1',
                'arrayKey2',
                'arrayKey3',
                'undefinedKey',
                'Objectsarray',
                'emptyVal',
            ])).toEqual('value¤1¤true¤value1¤value2¤3¤4¤false¤false¤');
        });

        it('should return "" for null', () => {
            expect(SnIndexationUtils.indexProperties(null, [
                'key1',
                'key2',
                'key3',
                'arrayKey1',
                'arrayKey2',
                'arrayKey3',
                'undefinedKey',
                'emptyVal',
            ])).toEqual('');
        });

        it('should return "" for undefined', () => {
            expect(SnIndexationUtils.indexProperties(undefined, [
                'key1',
                'key2',
                'key3',
                'arrayKey1',
                'arrayKey2',
                'arrayKey3',
                'undefinedKey',
                'emptyVal',
            ])).toEqual('');
        });
    });

    describe(SnIndexationUtils.indexStrings.name, () => {
        it('should index strings with ¤ at the start', () => {
            expect(SnIndexationUtils.indexStrings(['value1','value2','value3', ''], SmartNodesService.SEARCH_SEPARATOR)).toEqual('¤value1¤value2¤value3¤')
        });
        it('should index strings with "" at the start', () => {
            expect(SnIndexationUtils.indexStrings(['value1','value2','value3'], '')).toEqual('value1¤value2¤value3¤')
        });
    });
});
