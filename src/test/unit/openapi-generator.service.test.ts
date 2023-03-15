import { expect } from 'chai';
import { openAPIReadyFlow, openAPIReadyFlow2 } from '../fixtures/smartflowmodels';
import { OpenAPIGeneratorService, SmartModelsHead } from '../../providers';
import { SmartModel, WorkflowModel } from '../../interfaces';
import { SmartflowWithModel } from '../../providers/smart-flows/openapi-generator/smartflow-with-snmodel.type';
import { of } from 'rxjs';
import { SmartModelBuilder } from '../mock-builders';

describe(OpenAPIGeneratorService.name, () => {
    let generator: OpenAPIGeneratorService;

    beforeEach(async () => {
        generator = new OpenAPIGeneratorService(null, new SmartModelsHead(null), null, null);
        jest.spyOn(SmartModelsHead.prototype, 'find').mockImplementation((filter) => {
            return of(new SmartModelBuilder().withKey(filter.key ? filter.key : 'mockedmodel').build());
        })
    });

    describe(OpenAPIGeneratorService.prototype.generate.name, () => {
        it('should return formatted value', async () => {
            // GIVEN
            const smartflow1: SmartflowWithModel = { smartflow: openAPIReadyFlow as WorkflowModel, snModel: null };
            const smartflow2: SmartflowWithModel = { smartflow: openAPIReadyFlow2 as WorkflowModel, snModel: null };

            // WHEN
            const result = await generator.generate([smartflow1, smartflow2], undefined, true, { login: 'test', groups: [], customerKey: 'test' }).toPromise();
            const jsonResult = JSON.parse(JSON.stringify(result));

            // THEN
            const paths = Object.keys(jsonResult.paths);
            expect(paths.length).to.equal(3); // the 2 smartflows + auth token endpoint
            
            // smartflow 1 documentation
            const smartflow1Doc = jsonResult.paths[paths[0]];
            expect(smartflow1Doc.get).to.be.not.null;
            expect(smartflow1Doc.get.description).to.equal(smartflow1.smartflow.api.description);
            expect(smartflow1Doc.get.parameters.length).to.equal(5); // 7 declared variables in smartflow minus 2 internal variables
            
            // smartflow 1 responses
            const smartflow1Responses = Object.keys(smartflow1Doc.get.responses);
            expect(smartflow1Responses.length).to.equal(3);
            expect(smartflow1Responses[0]).to.equal('200');
            expect(smartflow1Doc.get.responses[smartflow1Responses[0]].description).to.equal(smartflow1.smartflow.api.result[0].description);
            expect(smartflow1Responses[1]).to.equal('401');
            expect(smartflow1Responses[2]).to.equal('5XX');

            // components
            expect(jsonResult.components).to.be.not.undefined;
            expect(jsonResult.components.responses).to.be.not.undefined;
            expect(jsonResult.components.securitySchemes).to.be.not.undefined;
            expect(jsonResult.components.schemas).to.be.not.undefined;
        });

        it('should generate the components section with securitySchemes and responses even if there is no schema to document', async () => {
            // GIVEN
            const smartflow: WorkflowModel = openAPIReadyFlow as WorkflowModel;
            // replacing so: type by string in the fixture
            const mavariable2 = smartflow.variables.find(v => v.key === 'mavariable-2');
            if (mavariable2) {
                Object.assign(mavariable2, { type: 'string' });
            }
            const result200 = smartflow.api?.result.find(r => r.code === '200');
            if (result200) {
                Object.assign(result200, { type: 'string' });
            }
            const smartflow1: SmartflowWithModel = { smartflow, snModel: null };

            // WHEN
            const result = await generator.generate([smartflow1], undefined, false, { login: 'test', groups: [], customerKey: 'test' }).toPromise();
            const jsonResult = JSON.parse(JSON.stringify(result));

            // THEN
            const paths = Object.keys(jsonResult.paths);
            expect(paths.length).to.equal(2); // the smartflow + auth token endpoint

            // components
            expect(jsonResult.components).to.be.not.undefined;
            expect(jsonResult.components.responses).to.be.not.undefined;
            expect(jsonResult.components.securitySchemes).to.be.not.undefined;
            expect(jsonResult.components.schemas).to.be.undefined;
        });
    });
});
