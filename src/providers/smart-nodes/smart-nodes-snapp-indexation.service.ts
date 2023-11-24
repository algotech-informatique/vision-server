import {
    SnModel,
    SnSynoticSearch,
    SnApp,
    SnPageWidget,
    SnPage,
    SnPageVariable,
    SnPageEventPipe,
    SnPageEvent,
} from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { SmartNodesService } from './smart-nodes.service';
import { SnIndexationUtils } from './smart-nodes-indextation-utils';

@Injectable()
export class SmartNodesSnAppIndexationService {
    _getCustomTokens(custom: any): string {
        return custom
            ? SnIndexationUtils.indexProperties(custom, [
                  'title',
                  'text',
                  'preview',
                  'columns',
                  'src',
                  'collection',
                  'collectionType',
                  'propertyKey',
                  'propertyType',
                  'value',
                  'imageUri',
                  'tag',
              ])
            : '';
    }

    _getSnPageEventPipeTokens(eventPipes: SnPageEventPipe[]): string {
        return eventPipes.reduce((result, eventPipe: SnPageEventPipe) => {
            return (
                result +
                SnIndexationUtils.indexProperties(eventPipe.smartflowResult, ['type']) +
                SnIndexationUtils.indexProperties(eventPipe, ['key', 'action']) +
                this._getCustomTokens(eventPipe.custom)
            );
        }, '');
    }

    _getConnectionsFromEventPipe(pipe: SnPageEventPipe[]): string[] {
        return pipe.reduce((results, eventPipe: SnPageEventPipe) => {
            results.push(
                `${
                    eventPipe.type === 'smartobjects'
                        ? 'so:' : eventPipe.type === 'workflow'
                        ? 'wf:' : eventPipe.type === 'smartflow'
                        ? 'sf:' : eventPipe.type === 'page::nav'
                        ? 'app:': eventPipe.type + ':'
                }${eventPipe.action}`,
                ...(eventPipe.smartflowResult ? [eventPipe.smartflowResult.type] : []),
            );
            return results;
        }, []);
    }

    pushWidgetIndex(
        snModel: SnModel,
        snVersionUuid: string,
        appUuid: string,
        widget: SnPageWidget,
        toIndex: SnSynoticSearch[],
    ) {
        const connectedTo = [];
        let texts = SmartNodesService.SEARCH_SEPARATOR + widget.name + SmartNodesService.SEARCH_SEPARATOR;
        texts += widget.events
            .map((event: SnPageEvent) => {
                connectedTo.push(...this._getConnectionsFromEventPipe(event.pipe));
                return this._getSnPageEventPipeTokens(event.pipe);
            })
            .join('');
        texts += this._getCustomTokens(widget.custom);

        texts += widget.rules
            .map((rule) => {
                let result = rule.conditions
                    .map((condition) => {
                        return SnIndexationUtils.indexProperties(condition, ['criteria', 'input', 'value']);
                    })
                    .join('');
                result += this._getCustomTokens(rule.custom);
                result += rule.events
                    .map((event: SnPageEvent) => {
                        connectedTo.push(...this._getConnectionsFromEventPipe(event.pipe));
                        return this._getSnPageEventPipeTokens(event.pipe);
                    })
                    .join('');
                return result;
            })
            .join('');

        toIndex.push(
            SnIndexationUtils._createSnSynopticSearch(
                snModel.key,
                snModel.uuid,
                snVersionUuid,
                appUuid,
                widget.id,
                snModel.updateDate,
                widget.name,
                connectedTo,
                texts,
                'widget',
            ),
        );
    }

    pushWidgetsIndex(
        snModel: SnModel,
        snVersionUuid: string,
        appUuid: string,
        widgets: SnPageWidget[],
        toIndex: SnSynoticSearch[],
    ) {
        widgets.forEach((widget: SnPageWidget) => {
            if (['tabModel'].indexOf(widget.typeKey) === -1) {
                this.pushWidgetIndex(snModel, snVersionUuid, appUuid, widget, toIndex);
            }
            if (widget.group && widget.group.widgets.length > 0) {
                this.pushWidgetsIndex(snModel, snVersionUuid, appUuid, widget.group.widgets, toIndex);
            }
        });
    }

    pushPageIndex(snModel: SnModel, snVersionUuid: string, appUuid: string, page: SnPage, toIndex: SnSynoticSearch[]) {
        this.pushWidgetsIndex(snModel, snVersionUuid, appUuid, page.widgets, toIndex);
        const connectedTo = [];
        let texts = SnIndexationUtils.indexLang(page.displayName, SmartNodesService.SEARCH_SEPARATOR);
        texts += page.variables.reduce((result, variable: SnPageVariable) => {
            if (
                variable.type &&
                variable.type.startsWith('so:') &&
                variable.type.split('so:')[1] &&
                variable.type.split('so:')[1] !== '*'
            ) {
                connectedTo.push(variable.type);
            }
            return result + SnIndexationUtils.indexProperties(variable, ['key', 'type']);
        }, '');
        texts += this._getSnPageEventPipeTokens(page.dataSources);
        connectedTo.push(...this._getConnectionsFromEventPipe(page.dataSources));
        page.events.forEach((event: SnPageEvent) => {
            texts += this._getSnPageEventPipeTokens(event.pipe);
            connectedTo.push(...this._getConnectionsFromEventPipe(event.pipe));
        });
        toIndex.push(
            SnIndexationUtils._createSnSynopticSearch(
                snModel.key,
                snModel.uuid,
                snVersionUuid,
                appUuid,
                page.id,
                snModel.updateDate,
                page.displayName,
                connectedTo,
                texts,
                'page',
            ),
        );
    }

    pushAppIndex(snModel: SnModel, snVersionUuid: string, app: SnApp, toIndex: SnSynoticSearch[]) {
        let texts = SnIndexationUtils.indexLang(
            snModel.displayName,
            SmartNodesService.SEARCH_SEPARATOR + snModel.key + SmartNodesService.SEARCH_SEPARATOR,
        );
        texts += app.description ? SnIndexationUtils.indexLang(app.description, '') : '';
        for (const page of app.pages) {
            this.pushPageIndex(snModel, snVersionUuid, app.id, page, toIndex);
        }
        toIndex.push(
            SnIndexationUtils._createSnSynopticSearch(
                snModel.key,
                snModel.uuid,
                snVersionUuid,
                app.id,
                '',
                snModel.updateDate,
                snModel.displayName,
                [],
                texts,
                'app',
            ),
        );
    }
}
