import { SnApp } from "../../interfaces";
import { SmartNodesSnAppIndexationService } from "../../providers";
import { appModel, appToIndex, button, buttonToIndex, custom1, custom2, custom3, deepWidget2ToIndex, deepWidget31ToIndex, deepWidget32ToIndex, deepWidget4ToIndex, deepWidgetToIndex, emptyPipPageEvent, eventsPipes1, image, imageToIndex, list, listToIndex, page1, page1ToIndex, page2, page2ToIndex, pageEvent1, tabHomeToIndex, tabInfosToIndex, tabMoreToIndex, table, tableColumn1ToIndex, tableToIndex, tabs, tabsToIndex, text, textToIndex, version1 } from "../fixtures/smart-nodes-snapp-indexation";


describe(SmartNodesSnAppIndexationService.name, () => {
    let snAppIndexService: SmartNodesSnAppIndexationService;
    beforeAll((done) => {
        snAppIndexService = new SmartNodesSnAppIndexationService();
        done();
    });

    describe(SmartNodesSnAppIndexationService.prototype._getSnPageEventPipeTokens.name, () => {
        it('should create a eventsPipes tokens', () => {

            expect(snAppIndexService._getSnPageEventPipeTokens(eventsPipes1))
                .toEqual('key1¤action1¤action1ticustomtle¤action1colucustommns¤action1customsrc¤action1collectcustomion¤action1collectionTcustomype¤action1propertycustomKey¤action1propertyTcustomype¤action1vacustomlue¤so:machin¤key2¤action2¤so:chose¤key3¤action3¤');
        });
    });

    describe(SmartNodesSnAppIndexationService.prototype._getCustomTokens.name, () => {
        it('should create a custom1 tokens', () => {

            expect(snAppIndexService._getCustomTokens(custom1))
                .toEqual('title1¤column1¤column2¤src1¤collection1¤collectionType1¤propertyKey1¤propertyType1¤value¤');
        });

        it('should create a custom2 tokens', () => {
            expect(snAppIndexService._getCustomTokens(custom2))
                .toEqual('title2¤src2¤collection2¤collectionType2¤propertyKey2¤propertyType2¤1¤');
        });

        it('should create a custom3 tokens', () => {
            expect(snAppIndexService._getCustomTokens(custom3))
                .toEqual('title3¤src3¤collection3¤collectionType3¤propertyKey3¤propertyType3¤false¤');
        });
    });

    describe(SmartNodesSnAppIndexationService.prototype._getConnectionsFromEventPipe.name, () => {
        it('should create a eventsPipes1 connections', () => {
            expect(snAppIndexService._getConnectionsFromEventPipe(eventsPipes1))
                .toEqual([
                    'type:action1',
                    'type:action2',
                    'so:machin',
                    'type:action3',
                    'so:chose'
                ]);
        });

        it('should create a eventsPipes connections', () => {
            expect(snAppIndexService._getConnectionsFromEventPipe(pageEvent1.pipe))
                .toEqual([
                    'wf:action1',
                    'sf:action2',
                    'app:action3',
                    'app:action4',
                    'call::onLoad:action5',
                    'url:action6'
                ]);
        });

        it('should create an empty connections', () => {

            expect(snAppIndexService._getConnectionsFromEventPipe(emptyPipPageEvent.pipe))
                .toEqual([]);
        });
    });

    describe(SmartNodesSnAppIndexationService.prototype.pushWidgetIndex.name, () => {
        it('should create a button synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushWidgetIndex(appModel, version1.uuid, version1.view.id, button, toIndex)
            expect(toIndex[0])
                .toMatchObject(buttonToIndex);
        });

        it('should create a image synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushWidgetIndex(appModel, version1.uuid, version1.view.id, image, toIndex)
            expect(toIndex[0])
                .toMatchObject(imageToIndex);
        });

        it('should create a text synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushWidgetIndex(appModel, version1.uuid, version1.view.id, text, toIndex)

            expect(toIndex[0])
                .toMatchObject(textToIndex);
        });

        it('should create a list synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushWidgetIndex(appModel, version1.uuid, version1.view.id, list, toIndex)
            expect(toIndex[0])
                .toMatchObject(listToIndex);
        });

        it('should create a list synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushWidgetIndex(appModel, version1.uuid, version1.view.id, tabs, toIndex)
            expect(toIndex[0])
                .toMatchObject(tabsToIndex);
        });
    });

    describe(SmartNodesSnAppIndexationService.prototype.pushWidgetsIndex.name, () => {
        it('should create a all widgets and subwidgets synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushWidgetsIndex(appModel, version1.uuid, version1.view.id, [button, image, list, table], toIndex)
            expect(toIndex.length)
                .toEqual(6);
            expect(toIndex[0])
                .toMatchObject(buttonToIndex);
            expect(toIndex[1])
                .toMatchObject(imageToIndex);
            expect(toIndex[2])
                .toMatchObject(listToIndex);
            expect(toIndex[3])
                .toMatchObject(textToIndex);
            expect(toIndex[4])
                .toMatchObject(tableToIndex);
            expect(toIndex[5])
                .toMatchObject(tableColumn1ToIndex);
        });

        it('should create a tabs widgets and subwidgets synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushWidgetsIndex(appModel, version1.uuid, version1.view.id, [tabs], toIndex)
            expect(toIndex[0])
                .toMatchObject(tabsToIndex);
            expect(toIndex[1])
                .toMatchObject(tabHomeToIndex);
            expect(toIndex[2])
                .toMatchObject(tabInfosToIndex);
            expect(toIndex[3])
                .toMatchObject(tabMoreToIndex);
        });
    });

    describe(SmartNodesSnAppIndexationService.prototype.pushPageIndex.name, () => {
        it('should create page1 and widgets and subwidgets synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushPageIndex(appModel, version1.uuid, version1.view.id, page1, toIndex)
            expect(toIndex.length)
                .toEqual(11);
            expect(toIndex[0])
                .toMatchObject(buttonToIndex);
            expect(toIndex[1])
                .toMatchObject(imageToIndex);
            expect(toIndex[2])
                .toMatchObject(listToIndex);
            expect(toIndex[3])
                .toMatchObject(textToIndex);
            expect(toIndex[4])
                .toMatchObject(tableToIndex);
            expect(toIndex[5])
                .toMatchObject(tableColumn1ToIndex);
            expect(toIndex[6])
                .toMatchObject(tabsToIndex);
            expect(toIndex[7])
                .toMatchObject(tabHomeToIndex);
            expect(toIndex[8])
                .toMatchObject(tabInfosToIndex);
            expect(toIndex[9])
                .toMatchObject(tabMoreToIndex);
            expect(toIndex[10])
                .toMatchObject(page1ToIndex);

        });

        it('should create page2 and widgets and subwidgets synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushPageIndex(appModel, version1.uuid, version1.view.id, page2, toIndex);

            expect(toIndex.length)
                .toEqual(6);
            expect(toIndex[0])
                .toMatchObject(deepWidgetToIndex);
            expect(toIndex[1])
                .toMatchObject(deepWidget2ToIndex);
            expect(toIndex[2])
                .toMatchObject(deepWidget31ToIndex);
            expect(toIndex[3])
                .toMatchObject(deepWidget32ToIndex);
            expect(toIndex[4])
                .toMatchObject(deepWidget4ToIndex);
            expect(toIndex[5])
                .toMatchObject(page2ToIndex);
        });
    });

    describe(SmartNodesSnAppIndexationService.prototype.pushAppIndex.name, () => {
        it('should create a all app synopticSearch', () => {
            const toIndex = [];
            snAppIndexService.pushAppIndex(appModel, version1.uuid, version1.view as SnApp, toIndex)
            expect(toIndex.length)
                .toEqual(18);
            expect(toIndex[0])
                .toMatchObject(buttonToIndex);
            expect(toIndex[1])
                .toMatchObject(imageToIndex);
            expect(toIndex[2])
                .toMatchObject(listToIndex);
            expect(toIndex[3])
                .toMatchObject(textToIndex);
            expect(toIndex[4])
                .toMatchObject(tableToIndex);
            expect(toIndex[5])
                .toMatchObject(tableColumn1ToIndex);
            expect(toIndex[6])
                .toMatchObject(tabsToIndex);
            expect(toIndex[7])
                .toMatchObject(tabHomeToIndex);
            expect(toIndex[8])
                .toMatchObject(tabInfosToIndex);
            expect(toIndex[9])
                .toMatchObject(tabMoreToIndex);
            expect(toIndex[10])
                .toMatchObject(page1ToIndex);
            expect(toIndex[11])
                .toMatchObject(deepWidgetToIndex);
            expect(toIndex[12])
                .toMatchObject(deepWidget2ToIndex);
            expect(toIndex[13])
                .toMatchObject(deepWidget31ToIndex);
            expect(toIndex[14])
                .toMatchObject(deepWidget32ToIndex);
            expect(toIndex[15])
                .toMatchObject(deepWidget4ToIndex);
            expect(toIndex[16])
                .toMatchObject(page2ToIndex);
            expect(toIndex[17])
                .toMatchObject(appToIndex);

        });
    });
});
