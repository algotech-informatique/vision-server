import { SnSynoticSearch, SnView } from "../../interfaces";
import { SmartNodesSnViewIndexationService } from "../../providers";
import {
    modelToIndex29,
    modelToIndex28,
    modelToIndex27,
    modelToIndex26,
    modelToIndex25,
    modelToIndex24,
    modelToIndex23,
    modelToIndex22,
    modelToIndex21,
    modelToIndex20,
    modelToIndex19,
    modelToIndex18,
    modelToIndex17,
    modelToIndex16,
    modelToIndex15,
    modelToIndex14,
    modelToIndex13,
    modelToIndex12,
    modelToIndex11,
    modelToIndex10,
    modelToIndex9,
    modelToIndex8,
    modelToIndex7,
    modelToIndex6,
    modelToIndex5,
    modelToIndex4,
    modelToIndex3,
    modelToIndex2,
    modelToIndex1,
    smartModel
} from "../fixtures/smart-nodes-smart-model";
import {
    box1, box1ToIndex, box2ToIndex, comment1, comment1ToIndex,
    comment2ToIndex, group1, group1ToIndex, group2ToIndex,
    model, node1, node1ToIndex, node2ToIndex, node3ToIndex,
    node4ToIndex, param1, param1Tokens, param2, param2Tokens, param3,
    param3Tokens, reportNodeToIndex, snNode1Tokens, version1, version2, version3,
    view1, view1ToIndex, view1Tokens, view2, view2Tokens, view3, view3ToIndex,
    view3Tokens, view4, view4Tokens
} from "../fixtures/smart-nodes-snview-indexation";


describe(SmartNodesSnViewIndexationService.name, () => {
    let snViewIndexService: SmartNodesSnViewIndexationService;
    beforeAll((done) => {
        snViewIndexService = new SmartNodesSnViewIndexationService();
        done();
    });

    describe(SmartNodesSnViewIndexationService.prototype._getsnParmTokens.name, () => {
        it('should create a param1 tokens', () => {
            expect(snViewIndexService._getsnParmTokens(param1, false, []))
                .toEqual(param1Tokens);
        });

        it('should create a param2 tokens', () => {
            expect(snViewIndexService._getsnParmTokens(param2, false, []))
                .toEqual(param2Tokens);
        });

        it('should create a param3 tokens', () => {
            expect(snViewIndexService._getsnParmTokens(param3, true, []))
                .toEqual(param3Tokens);
        });
    });

    describe(SmartNodesSnViewIndexationService.prototype._getSnNodeTokens.name, () => {
        it('should create a snNode tokens', () => {
            expect(snViewIndexService._getSnNodeTokens(node1, []))
                .toEqual(snNode1Tokens);
        });
    });

    describe(SmartNodesSnViewIndexationService.prototype._getSnViewTokens.name, () => {
        it('should create a view1 tokens', () => {
            expect(snViewIndexService._getSnViewTokens(view1, model, []))
                .toEqual(view1Tokens);
        });

        it('should create a view2 tokens', () => {
            expect(snViewIndexService._getSnViewTokens(view2, model, []))
                .toEqual(view2Tokens);
        });

        it('should create a view3 tokens', () => {
            expect(snViewIndexService._getSnViewTokens(view3, model, []))
                .toEqual(view3Tokens);
        });

        it('should create a view3 tokens', () => {
            expect(snViewIndexService._getSnViewTokens(view4, model, []))
                .toEqual(view4Tokens);
        });
    });

    describe(SmartNodesSnViewIndexationService.prototype.pushSnNodeIndex.name, () => {
        it('should create on elementToIndex from node1', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnNodeIndex(model, version1.uuid, version1.view.id, (version1.view as SnView).nodes[0], toIndex);
            expect(toIndex[0])
                .toMatchObject(node1ToIndex);
        });

        it('should create on elementToIndex from node2', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnNodeIndex(model, version2.uuid, version2.view.id, (version2.view as SnView).nodes[1], toIndex);
            expect(toIndex[0])
                .toMatchObject(node2ToIndex);
        });
    });

    describe(SmartNodesSnViewIndexationService.prototype.pushSnBoxesIndexes.name, () => {
        it('should create on elementToIndex from box1 ', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnBoxesIndexes([box1], model, version1.uuid, version1.view.id, toIndex);
            expect(toIndex[0])
                .toMatchObject(box1ToIndex);
        });
    });

    describe(SmartNodesSnViewIndexationService.prototype.pushSnCommentsIndexes.name, () => {
        it('should create on elementToIndex from comment1', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnCommentsIndexes([comment1], model, version1.uuid, version1.view.id, toIndex);
            expect(toIndex[0])
                .toMatchObject(comment1ToIndex);
        });
    });

    describe(SmartNodesSnViewIndexationService.prototype.pushSnGroupsIndexes.name, () => {
        it('should create on elementToIndex from group1', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnGroupsIndexes([group1], model, version1.uuid, version1.view.id, toIndex);
            expect(toIndex[0])
                .toMatchObject(group1ToIndex);
        });
    });

    describe(SmartNodesSnViewIndexationService.prototype.pushSnViewIndex.name, () => {
        it('should create on elementToIndex from version1', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnViewIndex(model, version1.uuid, (version1.view as SnView), toIndex);
            expect(toIndex.length).toBe(8);
            expect(toIndex[7])
                .toMatchObject(view1ToIndex);
            expect(toIndex[6])
                .toMatchObject(comment2ToIndex);
            expect(toIndex[5])
                .toMatchObject(comment1ToIndex);
            expect(toIndex[4])
                .toMatchObject(group2ToIndex);
            expect(toIndex[3])
                .toMatchObject(group1ToIndex);
            expect(toIndex[2])
                .toMatchObject(box2ToIndex);
            expect(toIndex[1])
                .toMatchObject(box1ToIndex);
            expect(toIndex[0])
                .toMatchObject(node1ToIndex);
        });

        it('should create on elementToIndex from version3', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnViewIndex(model, version3.uuid, (version3.view as SnView), toIndex);
            expect(toIndex.length).toBe((version3.view as SnView).nodes.length + 1);
            expect(toIndex[3])
                .toMatchObject(view3ToIndex);
            expect(toIndex[2])
                .toMatchObject(reportNodeToIndex);
            expect(toIndex[1])
                .toMatchObject(node4ToIndex);
            expect(toIndex[0])
                .toMatchObject(node3ToIndex);
        });

        it('should create on elementToIndex from view3 tokens', () => {
            const toIndex: SnSynoticSearch[] = [];
            snViewIndexService.pushSnViewIndex(smartModel, smartModel.versions[0].uuid, smartModel.versions[0].view as SnView, toIndex);
            expect(toIndex.length).toBe(29);
            expect(toIndex[28])
                .toMatchObject(modelToIndex29);
            expect(toIndex[27])
                .toMatchObject(modelToIndex28);
            expect(toIndex[26])
                .toMatchObject(modelToIndex27);
            expect(toIndex[25])
                .toMatchObject(modelToIndex26);
            expect(toIndex[24])
                .toMatchObject(modelToIndex25);
            expect(toIndex[23])
                .toMatchObject(modelToIndex24);
            expect(toIndex[22])
                .toMatchObject(modelToIndex23);
            expect(toIndex[21])
                .toMatchObject(modelToIndex22);
            expect(toIndex[20])
                .toMatchObject(modelToIndex21);
            expect(toIndex[19])
                .toMatchObject(modelToIndex20);
            expect(toIndex[18])
                .toMatchObject(modelToIndex19);
            expect(toIndex[17])
                .toMatchObject(modelToIndex18);
            expect(toIndex[16])
                .toMatchObject(modelToIndex17);
            expect(toIndex[15])
                .toMatchObject(modelToIndex16);
            expect(toIndex[14])
                .toMatchObject(modelToIndex15);
            expect(toIndex[13])
                .toMatchObject(modelToIndex14);
            expect(toIndex[12])
                .toMatchObject(modelToIndex13);
            expect(toIndex[11])
                .toMatchObject(modelToIndex12);
            expect(toIndex[10])
                .toMatchObject(modelToIndex11);
            expect(toIndex[9])
                .toMatchObject(modelToIndex10);
            expect(toIndex[8])
                .toMatchObject(modelToIndex9);
            expect(toIndex[7])
                .toMatchObject(modelToIndex8);
            expect(toIndex[6])
                .toMatchObject(modelToIndex7);
            expect(toIndex[5])
                .toMatchObject(modelToIndex6);
            expect(toIndex[4])
                .toMatchObject(modelToIndex5);
            expect(toIndex[3])
                .toMatchObject(modelToIndex4);
            expect(toIndex[2])
                .toMatchObject(modelToIndex3);
            expect(toIndex[1])
                .toMatchObject(modelToIndex2);
            expect(toIndex[0])
                .toMatchObject(modelToIndex1);
        });
    });
});
