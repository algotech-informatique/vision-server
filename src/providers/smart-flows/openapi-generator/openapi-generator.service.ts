import { Injectable } from '@nestjs/common';
import { OpenAPIObject, PathItemObject, SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { forkJoin, from, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { Environment, EnvironmentDirectory, IdentityRequest, SmartModel, SnModel, WorkflowModel } from '../../../interfaces';
import OpenAPIConverters from './openapi-converters';
import { SmartFlowsHead } from '../smart-flows.head';
import { SmartModelsHead } from '../../smart-models/smart-models.head';
import { EnvironmentHead } from '../../environment/environment.head';
import { SmartNodesHead } from '../../smart-nodes/smart-nodes.head';
import { SmartflowWithModel } from './smartflow-with-snmodel.type';
import { OpenAPIUtils } from './openapi-utils';
@Injectable()
export class OpenAPIGeneratorService {
    private readonly AUTHENTICATION_GROUP_NAME = 'Authentication';

    constructor(
        private readonly smartFlowsHead: SmartFlowsHead,
        private readonly smartModelsHead: SmartModelsHead,
        private readonly environmentHead: EnvironmentHead,
        private readonly smartNodesHead: SmartNodesHead
    ) { }

    /**
     * Generates smartflows openapi documentation for one customer (determined by the identity calling the method)
     */
    public generateSmartflowsDocumentation(identity: IdentityRequest): Observable<OpenAPIObject> {
        const $smartflows: Observable<SmartflowWithModel[]> = this.smartFlowsHead
            .find({ identity })
            .pipe(
                map((models: WorkflowModel | WorkflowModel[]): WorkflowModel[] => OpenAPIUtils.toArray(models)),
                map((smartflows: WorkflowModel[]) => {
                    return smartflows.map((smartflow: WorkflowModel) => {
                        return this.smartNodesHead
                            .find({ identity, uuid: smartflow.snModelUuid})
                            .pipe(
                                map((snModel: SnModel | SnModel[]): SmartflowWithModel => {
                                    return { smartflow, snModel: OpenAPIUtils.toObject(snModel) };
                                })
                            )
                    });
                }),
                mergeMap(($obs: Observable<SmartflowWithModel>[]): Observable<SmartflowWithModel[]> => {
                    return zip(...$obs);
                })
            );

        const $environment: Observable<Environment> = this.environmentHead.findOne({ identity });

        return forkJoin([$smartflows, $environment])
            .pipe(
                mergeMap((forkJoinResults: [SmartflowWithModel[], Environment]): Observable<OpenAPIObject> => {
                    const smartflows: SmartflowWithModel[] = forkJoinResults[0];
                    const environment: Environment = forkJoinResults[1];

                    return this.generate(smartflows, environment.smartflows, true, identity);
                })
            );
    }

    /**
     * Converts 1 to N smartflows into openapi documentation
     * 
     * @param smartflows the smartflows that have to be converted to openapi paths (1:1)
     * @param documentSchemas tells the generator to also generate a schema(s) documation and use $ref instead of primitives when types are objects (smartobjects)
     * @param identity optional parameter to provide if documentSchemas is true, used to identify user's client in order to get its smartmodels
     * @returns a full openapi documentation in json string format (ready to be saved in a file or in db)
     */
    public generate(smartflows: SmartflowWithModel[], directories?: EnvironmentDirectory[], documentSchemas?: boolean, identity?: IdentityRequest): Observable<OpenAPIObject> {
        const doc: OpenAPIObject = this.prepareDocument();
        const schemas: string[] = documentSchemas ? [] : null;
        const tags: string[] = [];

        this.addAuthenticationPaths(doc, tags);

        smartflows.forEach((smartflow: SmartflowWithModel) => {
            const pathItem: PathItemObject = OpenAPIConverters.toPathItem(smartflow.smartflow, schemas);

            if (smartflow.snModel && smartflow.snModel.dirUuid && directories) {
                const directory: EnvironmentDirectory = directories.find((dir) => dir.uuid === smartflow.snModel.dirUuid); // assuming there is no subdirectories in smartflows
                if (directory) {
                    pathItem[Object.keys(pathItem)[0]].tags = [directory.name];
                    if (!tags.includes(directory.name)) {
                        tags.push(directory.name);
                    }
                }
            }

            doc.paths[OpenAPIConverters.toOperationName(smartflow.smartflow)] = pathItem;
        });
        if (tags.length === 0) {
            tags.push('Smartflows');
        }

        doc.tags = OpenAPIConverters.toTagObjects(tags);
        doc.paths = OpenAPIUtils.orderObjectKeys(doc.paths, [this.AUTHENTICATION_GROUP_NAME]);

        doc.components = {};

        this.addSecuritySchemesAndDefaultResponses(doc);

        if (schemas && schemas.length > 0 && identity) {
            return this.addSchemasDocumentation(schemas, identity, doc);
        } else {
            return of(doc); // TODO do a document final validation to be sure it is fully compliant with openapi specs ?
        }
    }

    private addSecuritySchemesAndDefaultResponses(doc: OpenAPIObject) {
        doc.components.securitySchemes = {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            } as SecuritySchemeObject,
        };

        doc.components.responses = {
            UnauthorizedResponse: {
                description: 'Access token is missing or invalid'
            }
        };
    }

    private addAuthenticationPaths(doc: OpenAPIObject, tags: string[]) {
        doc.paths['/realms/vision/protocol/openid-connect/token'] = {
            post: {
                tags: [this.AUTHENTICATION_GROUP_NAME],
                summary: 'Get authorization token from KeyCloak',
                description: '',
                requestBody: {
                    content: {
                        'application/x-www-form-urlencoded': {
                            schema: {
                                type: 'object',
                                properties: {
                                    client_id: {
                                        type: 'string',
                                        description: 'pwa-studio',
                                    },
                                    username: {
                                        type: 'string',
                                        description: 'your-username',
                                    },
                                    password: {
                                        type: 'string',
                                        description: 'Azerty123',
                                    },
                                    grant_type: {
                                        type: 'string',
                                        description: 'password',
                                    }
                                },
                                required: ['client_id', 'username', 'password', 'grant_type'],
                                examples: {
                                    default: {
                                        summary: 'Basic auth with password',
                                        value: {
                                            client_id: 'pwa-studio',
                                            username: 'your-username',
                                            password: 'Azerty123',
                                            grant_type: 'password',
                                        }
                                    }
                                }
                            },
                        }
                    }
                },
                responses: {
                    '200': {
                        description: '', // TODO describe content 
                    }
                    // TODO describe error responses ?
                }
            }
        } as PathItemObject;
        tags.push(this.AUTHENTICATION_GROUP_NAME);
    }

    /**
     * Initialize a new Openapi document object with minimal metadata
     */
    private prepareDocument(): OpenAPIObject {
        return {
            openapi: '3.0.0',
            info: {
                title: 'Smartflows Documentation',
                description: 'Generated Smartflows documentation',
                contact: { // TODO use algotech info or client ?
                    name: 'Algo\'Tech',
                    url: 'https://www.algotech-informatique.com/',
                    email: 'contact@mail.fr'
                },
                version: '1' // TODO version API ?
            },
            paths: {}
        }
    }

    /**
     * Adds the schemas description in the documentation for each model name provided in @param schemas 
     * @param identity is required as every smartmodel in the schemas will be fetched in database in order to get its members and describe them.
     * @param documentation is expected to be an already valid Openapi documentation object that is only missing the schemas
     */
    private addSchemasDocumentation(schemas: string[], identity: IdentityRequest, documentation: OpenAPIObject): Observable<OpenAPIObject> {   
        const $smartModelsObservables: Observable<SmartModel[]>[] = schemas
            .map((modelKey: string): Observable<SmartModel[]> => {
                if (OpenAPIUtils.isAnySO(modelKey) || OpenAPIUtils.isSK(modelKey)) {
                    return of([{ key: modelKey } as SmartModel]);
                } else {
                    return this.smartModelsHead
                        .find({ identity, key: modelKey, submodel: true, ignoreModelKeys: schemas })
                        .pipe(
                            catchError(() => of([])),
                            map((modelAndSubModels: SmartModel | SmartModel[]): SmartModel[] => OpenAPIUtils.toArray(modelAndSubModels))
                        );
                }
            });
        
        return zip(...$smartModelsObservables)
            .pipe(
                map((models: SmartModel[][]): SmartModel[] => _.flatten(models)),
                map((models: SmartModel[]): SmartModel[] => _.uniqBy(models, 'key')),
                mergeMap((models: SmartModel[]): Observable<OpenAPIObject> => {
                    documentation.components.schemas = OpenAPIConverters.toComponents(models);
                    if (documentation.components.schemas) {
                        documentation.components.schemas = OpenAPIUtils.orderObjectKeys(documentation.components.schemas);
                    }

                    return of(documentation);
                })
            );
    }
}
