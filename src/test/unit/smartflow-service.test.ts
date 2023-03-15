import { SmartFlowsService } from '../../providers';
import { SoUtilsService } from '../../providers/workflow-interpretor';
import { launchOptions, launchOptionsMultiple, smartflowMultiple, smartflowSimple } from '../fixtures/smartflows-head-unit-test';
import { body, booleanProp, dateProp, headers, inputErrors, notEmptySimpleVar, numberMultipleVar, numberProp, numberSimpleVar, obseleteSimpleVar, queryParameters, queryStrings, requiredSimpleVar, soProp, stringProp, stringSimpleVar, uploadedFiles, uploadedFilesMultiple } from '../fixtures/smartflows-servcie-unit-test';


describe(SmartFlowsService.name, () => {
  const moment = require('moment')
  let smartFlowsService: SmartFlowsService
  let soUtilsService: SoUtilsService;
  let canStart;
  beforeAll( (done) => {
    soUtilsService = new SoUtilsService(null, null, null, null);
    smartFlowsService = new SmartFlowsService(null, soUtilsService)
    canStart = true;
    done();
  })

  describe(SmartFlowsService.prototype.getLauchOptions.name, () => {

    it('should return launchOptions', () => {
      const res = smartFlowsService.getLauchOptions(smartflowSimple, body, headers, queryParameters, queryStrings, uploadedFiles)
      expect(res).toStrictEqual(launchOptions);
    });

    it('should return launchOptionsMultipleFiles', () => {
      const res = smartFlowsService.getLauchOptions(smartflowMultiple, body, headers, queryParameters, queryStrings, uploadedFilesMultiple)
      expect(res).toStrictEqual(launchOptionsMultiple);
    });

    it('should return inputErrors && launchOptions: { key: "test-e2e-route-post", inputs: []', () => {
      const res = smartFlowsService.getLauchOptions(smartflowMultiple, null, null, null, [], [])
      expect(res).toStrictEqual({ inputErrors, launchOptions: { key: 'test-e2e-route-post', inputs: [] } });
    });
  });
  
  describe(SmartFlowsService.prototype._getformattedValue.name, () => {

    it('_getformattedValue(str) should return string', () => {
      const res = smartFlowsService._getformattedValue(stringProp, 'string')
      expect(res).toBe('string');
    });

    it('_getformattedValue(number) should return number', () => {
      const res = smartFlowsService._getformattedValue(numberProp, '2')
      expect(res).toBe(2);
    });

    it('_getformattedValue(number) should return number', () => {
      const res = smartFlowsService._getformattedValue(numberProp, 20.52)
      expect(res).toBe(20.52);
    });

    it('_getformattedValue(date) should return 2020-12-12T00:00:00+01:00', () => {
      const res = smartFlowsService._getformattedValue(dateProp, '2020/12/12')
      expect(res).toBe(moment('2020/12/12').startOf('day').format());
    });


    it('_getformattedValue(number, not number) should return error', () => {
      const res = smartFlowsService._getformattedValue(numberProp, 'toto')
      expect(res).toBe(null);
    });

    it('_getformattedValue(date, not date) should return error', () => {
      const res = smartFlowsService._getformattedValue(dateProp, 'toto')
      expect(res).toBe(null);
    });
  });

  describe(SmartFlowsService.prototype._tryGetSimpleValue.name, () => {

    it('_tryGetSimpleValue(str) should return string', () => {
      const res = smartFlowsService._tryGetSimpleValue(stringProp, 'string', 'reason')
      expect(res).toStrictEqual({ value: 'string' });
    });

    it('_tryGetSimpleValue(bool) should return true', () => {
      const res = smartFlowsService._tryGetSimpleValue(booleanProp, true, 'reason')
      expect(res).toStrictEqual({ value: true });
    });

    it('_tryGetSimpleValue(so) should return uuid', () => {
      const res = smartFlowsService._tryGetSimpleValue(soProp, '201187a6-e145-472a-accf-1c2db8df7850', 'reason')
      expect(res).toStrictEqual({ value: '201187a6-e145-472a-accf-1c2db8df7850' });
    });

    it('_tryGetSimpleValue(number) should return number', () => {
      const res = smartFlowsService._tryGetSimpleValue(numberProp, '2', 'reason')
      expect(res).toStrictEqual({ value: 2 });
    });

    it('_tryGetSimpleValue(number) should return number', () => {
      const res = smartFlowsService._tryGetSimpleValue(numberProp, 20.52, 'reason')
      expect(res).toStrictEqual({ value: 20.52 });
    });

    it('_tryGetSimpleValue(date) should return 2020-12-12T00:00:00+01:00', () => {
      const res = smartFlowsService._tryGetSimpleValue(dateProp, '2020/12/12', 'reason')
      expect(res).toStrictEqual({ value: moment('2020/12/12').startOf('day').format() });
    });

    it('_tryGetSimpleValue(str, not str) should return error', () => {
      const res = smartFlowsService._tryGetSimpleValue(stringProp, 36, 'not string')
      expect(res).toStrictEqual({ error: true, reason: 'not string' });
    });

    it('_tryGetSimpleValue(bool, not bool) should return error', () => {
      const res = smartFlowsService._tryGetSimpleValue(booleanProp, 'toto', 'not boolean')
      expect(res).toStrictEqual({ error: true, reason: 'not boolean' });
    });

    it('_tryGetSimpleValue(so, not uuid) should return error', () => {
      const res = smartFlowsService._tryGetSimpleValue(soProp, 'toto', 'not uuid')
      expect(res).toStrictEqual({ error: true, reason: 'not uuid' });
    });

    it('_tryGetSimpleValue(number, not number) should return error', () => {
      const res = smartFlowsService._tryGetSimpleValue(numberProp, 'toto', 'not number')
      expect(res).toStrictEqual({ error: true, reason: 'not number' });
    });

    it('_tryGetSimpleValue(date, not date) should return error', () => {
      const res = smartFlowsService._tryGetSimpleValue(dateProp, 'toto', 'not date')
      expect(res).toStrictEqual({ error: true, reason: 'not date' });
    });
  });

  describe(SmartFlowsService.prototype._tryGetMultipleValue.name, () => {

    it('_tryGetMultipleValue(str) should return string', () => {
      const res = smartFlowsService._tryGetMultipleValue(stringProp, 'string')
      expect(res).toStrictEqual({ value: ['string'] });
    });

    it('_tryGetMultipleValue(str) should return string', () => {
      const res = smartFlowsService._tryGetMultipleValue(stringProp, ['string', '36'])
      expect(res).toStrictEqual({ value: ['string', '36'] });
    });

    it('_tryGetMultipleValue(str, not str) should return error', () => {
      const res = smartFlowsService._tryGetMultipleValue(stringProp, ['string', 36])
      expect(res).toStrictEqual({ error: true, reason: 'INVALID-STRING-ARRAY' });
    });
  });

  describe(SmartFlowsService.prototype._tryGetValue.name, () => {

    it('_tryGetValue(str, keyExists = false) should return error', () => {
      const res = smartFlowsService._tryGetValue(requiredSimpleVar, false, 'string')
      expect(res).toStrictEqual({ error: true, reason: 'REQUIRED-PARAMETER' });
    });

    it('_tryGetValue(str, allowEmpty = false) should return error', () => {
      const res = smartFlowsService._tryGetValue(notEmptySimpleVar, true, null)
      expect(res).toStrictEqual({ error: true, reason: 'EMPTY-VALUE' });
    });

    it('_tryGetValue(str, deprecated = false) should return error', () => {
      const res = smartFlowsService._tryGetValue(notEmptySimpleVar, true, undefined)
      expect(res).toStrictEqual({ error: true, reason: 'EMPTY-VALUE' });
    });

    it('_tryGetValue(str) should return { value: string }', () => {
      const res = smartFlowsService._tryGetValue(stringSimpleVar, true, 'string')
      expect(res).toStrictEqual({ value: 'string' });
    });

    it('_tryGetValue([numbers]) should return { value: [numbers] }', () => {
      const res = smartFlowsService._tryGetValue(numberMultipleVar, true, [36, 57.3, 1E003])
      expect(res).toStrictEqual({ value: [36, 57.3, 1E003] });
    });
  });

  describe(SmartFlowsService.prototype._getUrlSegments.name, () => {

    it('_getUrlSegments(str, keyExists = false) should return error', () => {
      const errors = [];
      const res = smartFlowsService._getUrlSegments([stringSimpleVar, numberMultipleVar], ['toto'], errors)
      expect(res).toStrictEqual([{ key: stringSimpleVar.key, value: 'toto' }]);
      expect(errors).toStrictEqual([]);
    });

    it('_getUrlSegments(str, keyExists = false) should return error', () => {
      const errors = [];
      const res = smartFlowsService._getUrlSegments([stringSimpleVar, numberSimpleVar], ['toto', 36], errors)
      expect(res).toStrictEqual([{ key: stringSimpleVar.key, value: 'toto' }, { key: numberSimpleVar.key, value: 36 }]);
    });
  });
});
