import {
    SnModel,
    SnSynoticSearch,
    SnView,
    SnNode,
    SnSection,
    SnParam,
    SnFlow,
    SnComment,
    SnBox,
    SnGroup,
} from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { SmartNodesService } from './smart-nodes.service';
import { SnIndexationUtils } from './smart-nodes-indextation-utils';

@Injectable()
export class SmartNodesSnViewIndexationService {
    _getsnParmTokens(param: SnParam, getKey: boolean, connectedTo: string[]) {
        let texts = '';
        if (getKey) {
            texts += SnIndexationUtils.indexProperties(param, ['key']);
        }
        texts += SnIndexationUtils.indexProperties(param, ['value', 'types']);
        connectedTo.push(
            ...(Array.isArray(param.types) ? param.types : [param.types]).filter(
                (type) =>
                    type.startsWith('so:') &&
                    type.split('so:')[1] &&
                    type.split('so:')[1] !== '*' &&
                    connectedTo.indexOf(type) === -1,
            ),
        );
        if (param.displayName) {
            if (Array.isArray(param.displayName)) {
                texts += SnIndexationUtils.indexLang(param.displayName, '');
            }
        }
        return texts;
    }

    _getSnNodeTokens(snNode: SnNode, connectedTo: string[]) {
        let texts = SmartNodesService.SEARCH_SEPARATOR;
        texts += snNode.sections.reduce((accumulator: string, section: SnSection) => {
            accumulator += section.params.reduce(
                (result: string, param: SnParam) =>
                    result + this._getsnParmTokens(param, section.editable, connectedTo),
                '',
            );
            return accumulator;
        }, '');
        if (Array.isArray(snNode.displayName)) {
            texts += SnIndexationUtils.indexLang(snNode.displayName, '');
        }
        texts += snNode.params.reduce((result: string, param: SnParam) => {
            if (['report', 'smartFlow', 'workFlow'].indexOf(param.key) !== -1) {
                if (param.value) {
                    const connection = `${snNode.type === 'SnxReportNode' ? 'report:' : snNode.type === 'SnConnectorNode' ? 'sf:' : 'wf:'}${param.value}`;
                    if (connectedTo.indexOf(connection) === -1) connectedTo.push(connection);
                }
            }
            const dynamicsNode = ['SnDataNode', 'SnConnectorParameterNode'];
            return result + this._getsnParmTokens(param, dynamicsNode.includes(snNode.type), connectedTo);
        }, '');

        texts += snNode.flows.reduce((accumulator: string, flow: SnFlow) => {
            if (Array.isArray(flow.displayName)) {
                accumulator += SnIndexationUtils.indexLang(
                    flow.displayName,
                    '',
                );
            }
            accumulator += flow.params.reduce(
                (result: string, param: SnParam) =>
                    result + this._getsnParmTokens(param, flow.paramsEditable, connectedTo),
                '',
            );
            return accumulator;
        }, '');

        return texts;
    }

    _getSnViewTokens(snView: SnView, snModel: SnModel, connectedTo: string[]) {
        let texts = SnIndexationUtils.indexLang(
            snModel.displayName,
            SmartNodesService.SEARCH_SEPARATOR + snModel.key + SmartNodesService.SEARCH_SEPARATOR,
        );
        if (snView.options) {
            texts += snView.options.tags ? SnIndexationUtils.indexStrings(snView.options.tags, '') : '';
            texts += snView.options.variables
                ? snView.options.variables.reduce((results: string, variable) => {
                    if (
                        variable.type &&
                        variable.type.startsWith('so:') &&
                        variable.type.split('so:')[1] &&
                        variable.type.split('so:')[1] !== '*' &&
                        connectedTo.indexOf(variable.type) === -1
                    ) {
                        connectedTo.push(variable.type);
                    }
                    return results + SnIndexationUtils.indexProperties(variable, ['key', 'type', 'description']);
                }, '')
                : '';
            texts += snView.options.profiles
                ? snView.options.profiles.reduce(
                    (results: string, profile) => results + SnIndexationUtils.indexProperties(profile, ['name']),
                    '',
                )
                : '';
            texts += snView.options.api
                ? SnIndexationUtils.indexProperties(snView.options.api, ['route', 'type', 'summary', 'description'])
                : '';
        }
        return texts;
    }

    pushSnNodeIndex(
        snModel: SnModel,
        versionUuid: string,
        viewUuid: string,
        snNode: SnNode,
        toIndex: SnSynoticSearch[],
    ) {
        const connectedTo: string[] = [];
        const texts = this._getSnNodeTokens(snNode, connectedTo);
        toIndex.push(
            SnIndexationUtils._createSnSynopticSearch(
                snModel.key,
                snModel.uuid,
                versionUuid,
                viewUuid,
                snNode.id,
                snModel.updateDate,
                snNode.displayName,
                connectedTo,
                texts,
                'node',
            ),
        );
    }

    pushSnBoxesIndexes(
        boxes: SnBox[],
        snModel: SnModel,
        versionUuid: string,
        viewUuid: string,
        toIndex: SnSynoticSearch[],
    ) {
        for (const box of boxes) {
            const texts = Array.isArray(box.displayName)
                ? SnIndexationUtils.indexLang(box.displayName, SmartNodesService.SEARCH_SEPARATOR)
                : SmartNodesService.SEARCH_SEPARATOR + SnIndexationUtils.indexProperties(box, ['displayName']);
            toIndex.push(
                SnIndexationUtils._createSnSynopticSearch(
                    snModel.key,
                    snModel.uuid,
                    versionUuid,
                    viewUuid,
                    box.id,
                    snModel.updateDate,
                    box.displayName,
                    [],
                    texts,
                    'box',
                ),
            );
        }
    }

    pushSnCommentsIndexes(
        comments: SnComment[],
        snModel: SnModel,
        versionUuid: string,
        viewUuid: string,
        toIndex: SnSynoticSearch[],
    ) {
        for (const comment of comments) {
            const texts = Array.isArray(comment.comment)
                ? SnIndexationUtils.indexLang(comment.comment, SmartNodesService.SEARCH_SEPARATOR)
                : SmartNodesService.SEARCH_SEPARATOR + SnIndexationUtils.indexProperties(comment, ['comment']);
            toIndex.push(
                SnIndexationUtils._createSnSynopticSearch(
                    snModel.key,
                    snModel.uuid,
                    versionUuid,
                    viewUuid,
                    comment.id,
                    snModel.updateDate,
                    comment.comment,
                    [],
                    texts,
                    'comment',
                ),
            );
        }
    }

    pushSnGroupsIndexes(
        groups: SnGroup[],
        snModel: SnModel,
        versionUuid: string,
        viewUuid: string,
        toIndex: SnSynoticSearch[],
    ) {
        for (const group of groups) {
            const texts = Array.isArray(group.displayName)
                ? SnIndexationUtils.indexLang(group.displayName, SmartNodesService.SEARCH_SEPARATOR)
                : SmartNodesService.SEARCH_SEPARATOR + SnIndexationUtils.indexProperties(group, ['displayName']);
            toIndex.push(
                SnIndexationUtils._createSnSynopticSearch(
                    snModel.key,
                    snModel.uuid,
                    versionUuid,
                    viewUuid,
                    group.id,
                    snModel.updateDate,
                    group.displayName,
                    [],
                    texts,
                    'group',
                ),
            );
        }
    }

    pushSnViewIndex(snModel: SnModel, versionUuid: string, view: SnView, toIndex: SnSynoticSearch[]) {
        for (const node of view.nodes) {
            this.pushSnNodeIndex(snModel, versionUuid, view.id, node, toIndex);
        }
        this.pushSnBoxesIndexes(view.box, snModel, versionUuid, view.id, toIndex);
        this.pushSnGroupsIndexes(view.groups, snModel, versionUuid, view.id, toIndex);
        this.pushSnCommentsIndexes(view.comments, snModel, versionUuid, view.id, toIndex);
        if (snModel.type !== 'smartmodel') {
            const connectedTo: string[] = [];
            const texts = this._getSnViewTokens(view, snModel, connectedTo);
            toIndex.push(
                SnIndexationUtils._createSnSynopticSearch(
                    snModel.key,
                    snModel.uuid,
                    versionUuid,
                    view.id,
                    '',
                    snModel.updateDate,
                    snModel.displayName,
                    connectedTo,
                    texts,
                    snModel.type === 'report' ? 'report' : 'view',
                ),
            );
        }
    }
}
