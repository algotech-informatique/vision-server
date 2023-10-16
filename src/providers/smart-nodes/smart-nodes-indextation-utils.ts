import { Lang, SnSynoticSearch } from '../../interfaces';
import { SmartNodesService } from './smart-nodes.service';
import moment from 'moment';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
export class SnIndexationUtils {
    static _escapRegex(value: string): string {
        const specialCar = ['\\', '.', '-', '?', '+', '*', '[', ']', '{', '}', '(', ')', '^', '$', '|'];

        if (!_.isString(value)) {
            return value;
        }

        // replace all
        for (const car of specialCar) {
            const pieces = value.split(car);
            value = pieces.join(`\\${car}`);
        }
        return value;
    }

    static _createSnSynopticSearch(
        key: string,
        snModelUuid: string,
        snVersionUuid: string,
        snViewUuid: string,
        elementUuid: string,
        updateDate: string,
        displayName: Lang[] | string,
        connectedTo: string[],
        texts: string,
        type: 'page' | 'widget' | 'node' | 'view' | 'app' | 'box' | 'group' | 'comment' | 'report',
    ): SnSynoticSearch {
        return {
            uuid: UUID.UUID(),
            customerKey: process.env.CUSTOMER_KEY ? process.env.CUSTOMER_KEY : 'vision',
            deleted: false,
            createdDate: moment().format(),
            updateDate,
            key,
            snModelUuid,
            snVersionUuid,
            snViewUuid,
            elementUuid,
            displayName,
            connectedTo,
            texts,
            type,
        };
    }

    static isUuid(value: any): boolean {
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        return regexExp.test(value);
    }
    static indexLang(display: Lang[], initValue: string): string {
        return display.reduce((accumulator, current: Lang) => {
            accumulator = current.value
                ? accumulator + current.value + SmartNodesService.SEARCH_SEPARATOR
                : accumulator;
            return accumulator;
        }, initValue);
    }

    static indexProperties(object: any, properties: string[]): string {
        if (!object) {
            return '';
        }
        return properties.reduce((accumulator, property: string) => {
            if (
                object.hasOwnProperty(property) &&
                object[property] !== '' &&
                object[property] != null &&
                !this.isUuid(object[property])
            ) {
                accumulator += Array.isArray(object[property]) && object[property].length > 0 && !(object[property][0] instanceof Object)
                        ? this.indexStrings(object[property], '')
                        : !(object[property] instanceof Object)
                        ? object[property] + SmartNodesService.SEARCH_SEPARATOR
                        : '';
            }
            return accumulator;
        }, '');
    }

    static indexStrings(texts: string[], initValue: string): string {
        return texts.reduce((accumulator, text: string) => {
            if (text !== '' && !this.isUuid(text)) {
                accumulator = accumulator + text + SmartNodesService.SEARCH_SEPARATOR;
            }
            return accumulator;
        }, initValue);
    }
}
