import { expect } from 'chai';
import { openAPIReadyFlow } from '../fixtures/smartflowmodels';
import OpenAPIConverters from '../../providers/smart-flows/openapi-generator/openapi-converters';
import { WorkflowModel } from '../../interfaces';
import { WorkflowBuilder, WorkflowApiBuilder, WorkflowVariableBuilder, SmartModelBuilder, SmartPropertyModelBuilder } from '../mock-builders';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { OpenapiSkillSchemas } from '../../providers/smart-flows/openapi-generator/openapi-skills-schemas';

describe(OpenAPIConverters.name, () => {
    describe(OpenAPIConverters.toOperationName.name , () => {
        it('should convert smartflow to its operation name', () => {
            // GIVEN
            const smartflow: WorkflowModel = new WorkflowBuilder()
                .withKey('test-smartflow')
                .withApi(
                    new WorkflowApiBuilder().withRoute('test-smartflow').build()
                ).build();

            // THEN
            expect(OpenAPIConverters.toOperationName(smartflow)).to.equal('/test-smartflow')
        });
        it('should add path parameters in operation name', () => {
            // GIVEN
            const smartflow: WorkflowModel = new WorkflowBuilder()
                .withKey('test-smartflow')
                .withApi(
                    new WorkflowApiBuilder().withRoute('test-smartflow').build()
                ).withVariables([
                    new WorkflowVariableBuilder().withKey('var1').withUse('url-segment').build(),
                    new WorkflowVariableBuilder().withKey('var2').withUse('url-segment').build(),
                ])
                .build();

            // THEN
            expect(OpenAPIConverters.toOperationName(smartflow)).to.equal('/test-smartflow/{var1}/{var2}')
        });
        it('should convert real smartflow to operation name', () => {
            // GIVEN
            const smartflow = openAPIReadyFlow as WorkflowModel;

            // THEN
            expect(OpenAPIConverters.toOperationName(smartflow)).to.equal('/openapi-mic/{path-parameter}/{path-parameter-2}');
        });
    });
    describe(OpenAPIConverters.toSchema.name , () => {
        it('should convert primitive variable to a primitive schema', () => {
            // GIVEN
            const variable1 = new WorkflowVariableBuilder().withType('string').build();
            const variable2 = new WorkflowVariableBuilder().withType('number').build();

            // THEN
            expect(OpenAPIConverters.toSchema(variable1.type, variable1.multiple)).to.eql({ type: 'string' });
            expect(OpenAPIConverters.toSchema(variable2.type, variable2.multiple)).to.eql({ type: 'number' });
        });
        it('should convert primitive variable to a primitive array schema if variable is multiple', () => {
            // GIVEN
            const variable = new WorkflowVariableBuilder().withType('string').withMultiple(true).build();

            // THEN
            expect(OpenAPIConverters.toSchema(variable.type, variable.multiple)).to.eql({ type: 'array', items: { type: 'string' }});
        });
        it('should convert smart object variable to a primitive schema with format if no schemas array is provided', () => {
            // GIVEN
            const variable = new WorkflowVariableBuilder().withType('so:smartmodelname').build();

            // THEN
            expect(OpenAPIConverters.toSchema(variable.type, variable.multiple)).to.eql({ type: 'string', format: 'so:smartmodelname:uuid' });
        });
        it('should convert smart object variable to a reference if schemas array is provided', () => {
            // GIVEN
            const variable = new WorkflowVariableBuilder().withType('so:smartmodelname').build();
            const schemas = [];

            // THEN
            expect(OpenAPIConverters.toSchema(variable.type, variable.multiple, schemas)).to.eql({ $ref: '#/components/schemas/smartmodelname' });
            expect(schemas).to.have.length(1);
            expect(schemas[0]).to.equal('smartmodelname');
        });
        it('should convert smart object variable to an array of references if schemas array is provided and variable is multiple', () => {
            // GIVEN
            const variable = new WorkflowVariableBuilder().withType('so:smartmodelname').withMultiple(true).build();
            const schemas = [];

            // THEN
            expect(OpenAPIConverters.toSchema(variable.type, variable.multiple, schemas)).to.eql({ type: 'array', items: { $ref: '#/components/schemas/smartmodelname' }});
            expect(schemas).to.have.length(1);
            expect(schemas[0]).to.equal('smartmodelname');
        });
        it('should gather schemas in array when processing multiple smarmodels in a row', () => {
            // GIVEN
            const variable1 = new WorkflowVariableBuilder().withType('so:smartmodelname').withMultiple(true).build();
            const variable2 = new WorkflowVariableBuilder().withType('so:anothersmartmodel').build();
            const schemas = [];

            // THEN
            expect(OpenAPIConverters.toSchema(variable1.type, variable1.multiple, schemas)).to.eql({ type: 'array', items: { $ref: '#/components/schemas/smartmodelname' }});
            expect(OpenAPIConverters.toSchema(variable2.type, variable2.multiple, schemas)).to.eql({ $ref: '#/components/schemas/anothersmartmodel' });
            expect(schemas).to.have.length(2);
            expect(schemas[0]).to.equal('smartmodelname');
            expect(schemas[1]).to.equal('anothersmartmodel');
        });
        it('should not have multiple times the same schema in array when processing multiple smarmodels in a row', () => {
            // GIVEN
            const variable1 = new WorkflowVariableBuilder().withType('so:smartmodelname').withMultiple(true).build();
            const variable2 = new WorkflowVariableBuilder().withType('so:anothersmartmodel').build();
            const variable3 = new WorkflowVariableBuilder().withType('so:anothersmartmodel').build();
            const schemas = [];

            // THEN
            expect(OpenAPIConverters.toSchema(variable1.type, variable1.multiple, schemas)).to.eql({ type: 'array', items: { $ref: '#/components/schemas/smartmodelname' }});
            expect(OpenAPIConverters.toSchema(variable2.type, variable2.multiple, schemas)).to.eql({ $ref: '#/components/schemas/anothersmartmodel' });
            expect(OpenAPIConverters.toSchema(variable3.type, variable3.multiple, schemas)).to.eql({ $ref: '#/components/schemas/anothersmartmodel' });
            expect(schemas).to.have.length(2);
            expect(schemas[0]).to.equal('smartmodelname');
            expect(schemas[1]).to.equal('anothersmartmodel');
        });
        it('should handle types with format', () => {
            // GIVEN
            const datetimeVariable = new WorkflowVariableBuilder().withType('datetime').build();
            const datetimeArrayVariable = new WorkflowVariableBuilder().withType('datetime').withMultiple(true).build();

            // THEN
            expect(OpenAPIConverters.toSchema(datetimeVariable.type, datetimeVariable.multiple)).to.eql({ type: 'string', format: 'date-time' });
            expect(OpenAPIConverters.toSchema(datetimeArrayVariable.type, datetimeArrayVariable.multiple)).to.eql({ type: 'array', items: { type: 'string', format: 'date-time' }});
        });
    });
    describe(OpenAPIConverters.toSchemaProperties.name, () => {
        it('should tranform a smartobject into openapi schema', () => {
            // GIVEN
            const model = new SmartModelBuilder()
                .withProperties([
                    new SmartPropertyModelBuilder()
                        .withKeyAndType('name', 'string')
                        .build(),
                    new SmartPropertyModelBuilder()
                        .withKeyAndType('tags', 'string')
                        .withMultiple(true)
                        .build(),
                    new SmartPropertyModelBuilder()
                        .withKeyAndType('order', 'number')
                        .build(),
                ])
                .build();

            // WHEN
            const props = OpenAPIConverters.toSchemaProperties(model);

            // THEN
            expect(Object.keys(props)).to.have.length(4);
            expect(props['uuid']).to.be.not.null;
            expect(props['uuid'].format).to.equal('uuid');
            expect(props['name']).to.be.not.null;
            expect(props['name'].type).to.equal('string');
            expect(props['tags']).to.be.not.null;
            expect(props['tags'].type).to.equal('array');
            expect((props['tags'].items as SchemaObject).type).to.equal('string');
            expect(props['order']).to.be.not.null;
            expect(props['order'].type).to.equal('number');
        });
        it('should transform so: properties into refs', () => {
            // GIVEN
            const model = new SmartModelBuilder()
                .withProperties([
                    new SmartPropertyModelBuilder()
                        .withKeyAndType('name', 'string')
                        .build(),
                    new SmartPropertyModelBuilder()
                        .withKeyAndType('obj', 'so:othermodel')
                        .build()
                ])
                .build();

            // WHEN 
            const props = OpenAPIConverters.toSchemaProperties(model);

            // THEN
            expect(Object.keys(props)).to.have.length(3);
            expect(props['uuid']).to.be.not.null;
            expect(props['name']).to.be.not.null;
            expect(props['obj']).to.be.not.null;
            expect((props['obj'] as ReferenceObject).$ref).to.equal('#/components/schemas/othermodel')
        });
        it('should transform sk: properties into skill ref', () => {
            // GIVEN
            const model = new SmartModelBuilder()
                .withProperties([
                    new SmartPropertyModelBuilder()
                        .withKeyAndType('skilled-prop', 'sk:atGeolocation')
                        .build()
                ])
                .build();

            // WHEN 
            const props = OpenAPIConverters.toSchemaProperties(model);

            // THEN
            expect(Object.keys(props)).to.have.length(2);
            expect(props['skilled-prop'].type)
            expect((props['skilled-prop'] as ReferenceObject).$ref).to.equal('#/components/schemas/sk:atGeolocation')
        });
        it('should return default properties and all skills if provided model is so:*', () => {
            // GIVEN
            const model = new SmartModelBuilder()
                .withKey('so:*')
                .build();

            // WHEN 
            const props = OpenAPIConverters.toSchemaProperties(model);

            // THEN
            expect(Object.keys(props)).to.have.length(4);
            expect(props['uuid']).to.be.not.null;
            expect(props['modelKey']).to.be.not.null;
            expect(props['...props']).to.be.not.null;
            expect(props['skills']).to.be.not.null;
            expect(Object.keys(props['skills']['properties'])).to.have.length(Object.keys(OpenapiSkillSchemas.SKILLS).length);
        });
        it('should return default + skill properties if provided model is sk:', () => {
            // GIVEN
            const model = new SmartModelBuilder()
                .withKey('sk:atGeolocation')
                .build();

            // WHEN 
            const props = OpenAPIConverters.toSchemaProperties(model);

            // THEN
            expect(Object.keys(props)).to.have.length(4);
            expect(props['uuid']).to.be.not.null;
            expect(props['modelKey']).to.be.not.null;
            expect(props['...props']).to.be.not.null;
            expect(props['skills']).to.be.not.null;
            const geo = props['skills']['properties']['atGeolocation']['properties']['geo'] as SchemaObject;
            expect(geo).to.be.not.null;
            expect(geo.type).to.equal('array');
            const skillSchema = geo.items as SchemaObject;
            expect(skillSchema.type).to.equal('object');
            expect(skillSchema.properties).to.be.not.null;
            expect(Object.keys(skillSchema.properties)).to.have.length(3);
            expect(skillSchema.properties['uuid']).to.be.not.null;
            expect(skillSchema.properties['layerKey']).to.be.not.null;
            expect(skillSchema.properties['geometries']).to.be.not.null;
            // etc...
        });
        it('should add skills props in model schema if model is so: with some skills toggled on', () => {
            // GIVEN
            const model = new SmartModelBuilder()
                .withKey('so:mymodel')
                .withProperties([
                    new SmartPropertyModelBuilder().withKeyAndType('NAME', 'string').build()
                ])
                .withSkills({
                    atGeolocation: true, //
                    atDocument: false,
                    atSignature: false,
                    atTag: true, //
                    atMagnet: false
                })
                .build();
            
            // WHEN
            const props = OpenAPIConverters.toSchemaProperties(model);

            // THEN
            expect(Object.keys(props)).to.have.length(3);
            expect(props['uuid']).to.be.not.null;
            expect(props['NAME']).to.be.not.null;
            expect(props['skills']).to.be.not.null;
            const skillsProps = props['skills']['properties'];
            expect(Object.keys(skillsProps)).to.eql(['atGeolocation', 'atTag']);
            expect(skillsProps['atGeolocation']['properties']['geo']['type']).to.equal('array');
            expect(skillsProps['atTag']['properties']['tags']['type']).to.equal('array');
        });
    });
});