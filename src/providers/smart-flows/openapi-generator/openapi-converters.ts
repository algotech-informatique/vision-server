import { 
    PathItemObject, OperationObject, ParameterObject, ParameterLocation, ResponsesObject, 
    ResponseObject, SchemaObject, ReferenceObject, ComponentsObject, RequestBodyObject, TagObject
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { SmartModel, WorkflowModel, WorkflowVariableModel } from '../../../interfaces';
import { OpenapiSkillSchemas } from './openapi-skills-schemas';
import { OpenAPIUtils } from './openapi-utils';

export default class OpenAPIConverters {
    private constructor() { } // static class

    /**
     * Converts a smartflow model to an openapi path item object
     * 
     * @param smartflow the smartflow to be converted to an openapi path
     * @param schemas optional array of schemas that will be used to document the smart models
     * @returns a path item object in the sense of openapi
     */
    public static toPathItem(smartflow: WorkflowModel, schemas?: string[]): PathItemObject {
        const supportedMethods = ['get', 'put', 'post', 'patch', 'delete'];
        const method = smartflow.api.type.toLowerCase();

        if (!supportedMethods.includes(method)) {
            throw new Error(`Unsupported smartflow http method found: [${method}], unable to process smartflow`)
        }

        const operation: OperationObject = {
            summary: smartflow.api.summary,
            description: smartflow.api.description,
            parameters: this.toParameters(smartflow.variables, schemas),
            responses: this.toResponses(smartflow, schemas),
            security: [{ bearerAuth: [] }]
        }

        const bodyVariables = smartflow.variables.filter(variable => !variable.use || variable.use === 'body');
        if (bodyVariables) {
            operation.requestBody = this.toRequestBody(bodyVariables, schemas);
        }

        return { [method]: operation };
    }

    public static toOperationName(smartflow: WorkflowModel): string {
        let name = '/' + smartflow.key;
        const urlSegments = smartflow.variables.filter(variable => variable.use === 'url-segment');
        if (urlSegments.length > 0) {
            name += '/' + urlSegments.map(variable => '{' + variable.key + '}').join('/');
        }
        /*const getParams = smartflow.variables.filter(variable => variable.use === 'query-parameter');
        if (getParams.length > 0) {
            name += '?' + getParams.map(variable => variable.key + '=').join('&');
        }*/ // TODO do we also add GET params ? this can be really long depending on their number

        return name;
    }

    public static toParameters(smartflowVariables: WorkflowVariableModel[], schemas?: string[]): ParameterObject[] {
        return smartflowVariables
            .filter(variable => variable.use && variable.use !== 'body') // TODO are internal variables (with no .use) to be documented ?
            .map(variable => {
                return {
                    name: variable.key,
                    description: variable.description,
                    deprecated: variable.deprecated,
                    allowEmptyValue: variable.allowEmpty,
                    required: variable.required,
                    in: this.toParameterLocation(variable),
                    schema: this.toSchema(variable.type, variable.multiple, null /* schemas */) // TODO disabled schema description in parameters for now
                } as ParameterObject;
            });
    }

    public static toParameterLocation(smartflowVariable: WorkflowVariableModel): ParameterLocation {
        switch(smartflowVariable.use) {
            case 'url-segment':
                return 'path';
            case 'query-parameter':
                return 'query';
            case 'header':
                return 'header';
            case 'formData':
                return 'header'; // FIXME not sure about that, shouldnt this be in RequestBody instead?
            default:
                throw new Error(`'Unknown variable use [${smartflowVariable.use}]`);
        }
    }

    public static toResponses(smartflow: WorkflowModel, schemas?: string[]): ResponsesObject {
        let responses: ResponsesObject = {};
        smartflow.api.result.forEach((result, i) => {
            if (result.code) { // FIXME what to do if code is not defined ? do not add response, log error ?
                responses[result.code] = { 
                    description: result.description,
                    content: {
                        [result.content || 'unamed-content']: { // FIXME what to do if content is not defined ? do not add content ?
                            schema: this.toSchema(result.type, result.multiple, schemas)
                        }
                    }
                } as ResponseObject;
            }
        });
        if (Object.keys(responses).length === 0) {
            responses['200'] = {
                description: 'smartflow executed successfully'
            }
        }

        responses['401'] = {
            $ref: '#/components/responses/UnauthorizedResponse',
        } as ReferenceObject;

        return responses;
    }

    public static toComponents(smartmodels: SmartModel[]): Record<string, SchemaObject | ReferenceObject> {
        let schemas = {}

        smartmodels.forEach(smartmodel => {
            schemas[smartmodel.key] = this.toComponentsSchema(smartmodel);
        });

        return schemas;
    }

    public static toComponentsSchema(smartmodel: SmartModel): SchemaObject {
        return {
            type: 'object',
            properties: this.toSchemaProperties(smartmodel)
        } as SchemaObject;
    }

    public static toSchemaProperties(smartmodel: SmartModel): Record<string, SchemaObject> {
        let properties = {}

        properties['uuid'] = { type: 'string', format: 'uuid' };
        if (OpenAPIUtils.isAnySO(smartmodel.key) || OpenAPIUtils.isSK(smartmodel.key)) {
            properties['modelKey'] = { type: 'string' };
            properties['...props'] = { type: 'object' };
        } else {
            smartmodel.properties.forEach(property => {
                properties[property.key] = this.toSchema(property.keyType, property.multiple, []);
            });
        }

        if (OpenAPIUtils.isSK(smartmodel.key)) {
            OpenapiSkillSchemas.addSkillsSchema(properties, smartmodel.key);
        } else if (OpenAPIUtils.isAnySO(smartmodel.key)) {
            OpenapiSkillSchemas.addSkillsSchema(properties, 'sk:*');
        } else {
            const sk = JSON.parse(JSON.stringify(smartmodel.skills)); // TODO I'm not sure why this is the only way to break reference to smartmodel, even with _.cloneDeep the Object.entries(sk) will list parent entries also
            const positiveSkills = Object.entries(sk)
                .filter((entry) => entry[1] === true)
                .map((entry) => entry[0]); // skills that have "true" value in model.skills
            OpenapiSkillSchemas.addSkillsSchema(properties, ...positiveSkills);
        }

        return properties;
    }

    public static toSchema(type: string, multiple: boolean, schemas?: string[]): SchemaObject | ReferenceObject {
        let schema: SchemaObject | ReferenceObject;
        if (schemas && OpenAPIUtils.isSmartType(type)) {
            if (!OpenAPIUtils.isAnySO(type) && !OpenAPIUtils.isSK(type)) {
                type = type.slice(3);
            }
            if (!schemas.includes(type)) {
                schemas.push(type);
            }
            schema = { $ref: '#/components/schemas/' + type };
        } else {
            schema = this.toDataType(type);
        }

        if (multiple) {
            return {
                type: 'array',
                items: schema
            } as SchemaObject;
        } else {
            return schema as SchemaObject;
        }
    }

    public static toDataType(type: string): SchemaObject {
        if(OpenAPIUtils.isSO(type)) {
            return {
                type: 'string',
                format: type + ':uuid'
            }
        } else {
            switch(type) {
                case 'string':
                case 'number':
                case 'boolean':
                case 'integer':
                    return { type };
                case 'date':
                    return {
                        type: 'string',
                        format: 'date'
                    };
                case 'datetime':
                    return {
                        type: 'string',
                        format: 'date-time'
                    };
                case 'time':
                    return {
                        type: 'string',
                        format: 'time'
                    }
                default:
                    return {
                        type: 'string',
                        format: type
                    }
                }
        }
    }

    public static toRequestBody(bodyVariables: WorkflowVariableModel[], schemas?: string[]): RequestBodyObject {
        if (bodyVariables.length === 1 && bodyVariables[0].use === 'body') {
            return {
                description: bodyVariables[0].description,
                required: bodyVariables[0].required,
                content: {
                    'application/json': {
                        schema: this.toSchema(bodyVariables[0].type, bodyVariables[0].multiple, schemas)
                    }
                }
            } as RequestBodyObject;
        } else {
            let properties = {};
            bodyVariables.forEach(variable => {
                properties[variable.key] = this.toSchema(variable.type, variable.multiple, schemas);
            });

            return {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties
                        }
                    }
                }
            } as RequestBodyObject;
        }
    }

    public static toTagObjects(tags: string[]): TagObject[] { // TODO add more info to tags ?
        return tags.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        }).map((tag) => {
            return {
                name: tag
            } as TagObject;
        });
    }
}
