import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SmartModelDto, SmartObjectDto } from '@algotech/core';
import * as _ from 'lodash';
import { SettingsDataService, SmartObjectsHead } from '../../providers';
import { SmartObject } from '../../interfaces';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthorizationService {

    constructor(
        private smartObjetsHead: SmartObjectsHead,
        private readonly settingsDataService: SettingsDataService) { }

    public getSmartModel(modelKey: string): Observable<SmartModelDto> {
        return this.settingsDataService.getContext().pipe(
            map((context) => {
                const find = context.smartmodels.find((sm: SmartModelDto) => sm.key === modelKey);
                if (find) {
                    return find;
                }
                
                throw new BadRequestException('model unknow');
            }),
        );
    }

    public getSmartObject(uuid: string, identity): Observable<SmartObject> {
        return this.smartObjetsHead.find({ identity, uuid }) as Observable<SmartObject>;
    }

    public getSmartObjectChecker(smartObject, smartModel, userGroups, operation: 'RW' | 'R'): SmartObjectDto {
        // filter smartObject
        const smartObjectPermission = this.permissionResolver(smartModel.permissions, userGroups, operation);
        if (smartObjectPermission) {
            smartObject.properties = smartObject.properties.map((property) => {
                const modelProperty = _.find(smartModel.properties, (smProperty) => property.key === smProperty.key);
                // filter smartObject property
                if (modelProperty) {
                    if (this.permissionResolver(modelProperty.permissions, userGroups, operation)) {
                        return property;
                    }
                }
                return null;
            }).filter((property) => property !== null);
            return smartObject;
        } else {
            throw new ForbiddenException(`Not allowed to perform '${operation}' operation on this smart object '${smartObject.modelKey}'`);
        }
    }

    public deleteSmartObjectChecker(smartModel, userGroups, operation: 'RW' | 'R'): boolean {
        return this.permissionResolver(smartModel.permissions, userGroups, operation);
    }

    public patchSmartObjectChecker(patches, smartModel, userGroups, operation: 'RW' | 'R') {
        const regex = /^\/properties/;
        const regexPropertyKey = /\/properties\/\[key:(.*?)\]/;
        let patchKey;
        let smProperty;
        for (const patch of patches) {
            if (regex.test(patch.path)) {
                // TODO envoyer un message SENTRY si la regex ne marche pas
                patchKey = patch.path === '/properties/[?]' ? patch.value.key : patch.path.match(regexPropertyKey)[1];
                smProperty = _.find(smartModel.properties, (property) => property.key === patchKey);
                if (smProperty) {
                    if (!this.permissionResolver(smProperty.permissions, userGroups, operation)) {
                        throw new ForbiddenException();
                    }
                } else {
                    throw new ForbiddenException();
                }
            } else {
                if (!this.permissionResolver(smartModel.permissions, userGroups, operation)) {
                    throw new ForbiddenException();
                }
            }
        }
    }

    public postSmartObjectChecker(smartObject, smartModel, userGroups, operation: 'RW' | 'R'): SmartObjectDto | any {
        // filter smartObject
        const smartObjectPermission = this.permissionResolver(smartModel.permissions, userGroups, operation);
        if (smartObjectPermission) {
            smartObject.properties = smartModel.properties.map((property) => {
                const objectProperty = _.find(smartObject.properties, (soProperty) => property.key === soProperty.key);
                // filter smartObject property
                if (objectProperty && this.permissionResolver(property.permissions, userGroups, operation)) {
                    return objectProperty;
                } else {//supprimé à déplacer dans le studio en warning lors de la conception de workflow/smarflow sur les tâche créer/éditerun smartObject et formulare 
                    /* if (property.required && property.defaultValue === undefined) {
                        // tslint:disable-next-line: max-line-length
                        throw new ForbiddenException(`The property '${property.key}' is required, provide a default value for this property in the SmartModel or provide a value in this SmartObject property`);
                    } else { */
                    return { key: property.key, value: property.defaultValue };
                    /* } */
                }
            }).filter((property) => property !== null);
            return smartObject;
        } else {
            throw new ForbiddenException(`Not allowed to perform '${operation}' operation on this smart object.`);
        }
    }

    public permissionResolver(permissions, securityGroups: string[], operation): boolean {
        let currentPermission = 'X';
        for (const securityGroup of securityGroups) {
            for (const permissionR of permissions.R) {
                if (securityGroup === permissionR) {
                    currentPermission = 'R';
                    break;
                }
            }
        }

        for (const securityGroup of securityGroups) {
            for (const permissionRW of permissions.RW) {
                if (securityGroup === permissionRW) {
                    currentPermission = 'RW';
                    break;
                }
            }
        }

        return !((operation === 'RW' && currentPermission === 'R') || currentPermission === 'X');
    }

    public searchSmartObjectChecker(smartObjectModelKey, smartObjectPropertyKey, smartModel, userGroups, operation: 'RW' | 'R') {
        // filter smartObject
        const smartObjectPermission = this.permissionResolver(smartModel.permissions, userGroups, operation);
        if (smartObjectPermission) {
            const modelProperty = _.find(smartModel.properties, (smProperty) => smartObjectPropertyKey === smProperty.key);
            if (modelProperty) {
                if (!this.permissionResolver(modelProperty.permissions, userGroups, operation)) {
                    throw new ForbiddenException(`Not allowed to perform '${operation}' operation on this property '${modelProperty.key}'`);
                }
            }
        } else {
            throw new ForbiddenException(`Not allowed to perform '${operation}' operation on this smart object '${smartObjectModelKey}'`);
        }
    }

}
