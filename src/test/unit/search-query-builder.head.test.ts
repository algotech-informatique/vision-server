import { SearchQueryBuilderHead } from "../../providers";
import {
  filterbetween, filterDifferent, filterExists, filterisNull, filterStartWith, filters, filterContains,
  filterEndWith, filterEquals, filtergt, filterlt, filtergte, filterlte, filterisIn,
  uniqueValuesAggregationPipeStarWithValue, uniqueValuesAggregationPipeNoValue, startsWithRegex,
  containsWithRegex, endsWithWithRegex, eqRequest, neRequest, gtRequest, ltRequest, gteRequest, lteRequest,
  nullKey1Request, betWeenRequest, inRequest, existsRequest, $match, querySO, docQueries, facePipeline2, facePipeline1,
  $facet,
  ParentlookUp1,
  ParentlookUp2,
  filtersSubDoc,
  facetsResutls,
  model1,
  model2,
  model4,
  model3,
  searchStartsWithRegex,
  searchContainsRegex,
  searchEndsWithRegex,
  searchDifferent,
  searchequls,
  searchisIn,
} from "../fixtures/search-query-builder";

describe(SearchQueryBuilderHead.name, () => {
  let sqbuilder: SearchQueryBuilderHead;
  beforeAll((done) => {
    sqbuilder = new SearchQueryBuilderHead();
    done();
  });
  

  describe(SearchQueryBuilderHead.prototype._escapRegex.name, () => {
    it('should return escaped regex', () => {
      const request = sqbuilder._escapRegex('\\, ., -, ?, +, *, [, ], {, }, (, ), ^, $, |val');
      expect(request).toEqual('\\\\, \\., \\-, \\?, \\+, \\*, \\[, \\], \\{, \\}, \\(, \\), \\^, \\$, \\|val');
    });
  });

  describe(SearchQueryBuilderHead.prototype._startsWith.name, () => {
    it('should return startWith regex', () => {
      const request = sqbuilder._startsWith('val', 'prop');
      expect(request).toEqual({ 'properties.prop': /^val.*/i });
    });
  });

  describe(SearchQueryBuilderHead.prototype._dontStartsWith.name, () => {
    it('should return dontStartsWith regex', () => {
      const request = sqbuilder._dontStartsWith('val', 'prop');
      expect(request).toEqual({ 'properties.prop': /^(?!val).*/i });
    });
  });

  describe(SearchQueryBuilderHead.prototype._endsWith.name, () => {
    it('should return _endsWith regex', () => {
      const request = sqbuilder._endsWith('val1', 'prop');
      expect(request).toEqual({ 'properties.prop': /.*val1$/i });
    });
  });
  
  describe(SearchQueryBuilderHead.prototype._doesntContain.name, () => {
    it('should return _doesntContain regex', () => {
      const request = sqbuilder._doesntContain('val2', 'prop');
      expect(request).toEqual({ 'properties.prop': /^(?!.*val2).*/i });
    });
  });

  describe(SearchQueryBuilderHead.prototype._contains.name, () => {
    it('should return _contains regex', () => {
      const request = sqbuilder._contains('val2', 'prop');
      expect(request).toEqual({ 'properties.prop': /.*val2.*/i });
    });
  });

  describe(SearchQueryBuilderHead.prototype._equals.name, () => {
    it('should return equality request', () => {
      const request = sqbuilder._equals(50, 'prop');
      expect(request).toEqual({ 'properties.prop': { $eq: 50 } });
    });

    it('should return $ne request', () => {
      const request = sqbuilder._equals(false, 'prop', true);
      expect(request).toEqual({ 'properties.prop': { $ne: false } });
    });
  });

  describe(SearchQueryBuilderHead.prototype._isNull.name, () => {
    it('should return isNull request', () => {
      const request = sqbuilder._isNull('prop');
      expect(request).toEqual({ $or: [{ 'properties.prop': { $eq: null } }, { 'properties.prop': { $size: 0 } }]});
    });
  });

  describe(SearchQueryBuilderHead.prototype._exists.name, () => {
    it('should return $exists request', () => {
      const request = sqbuilder._exists('prop');
      expect(request).toEqual({ 'properties.prop': { $exists: true } });
    });
  });

  describe(SearchQueryBuilderHead.prototype._isIn.name, () => {
    it('should return $in request', () => {
      const request = sqbuilder._isIn([100, true, 'toto'], 'prop');
      expect(request).toEqual({ 'properties.prop': { $in: [100, true, 'toto'] } });
    });
  });

  describe(SearchQueryBuilderHead.prototype._isgt.name, () => {
    it('should return $gt request', () => {
      const request = sqbuilder._isgt(100, 'prop');
      expect(request).toEqual({ 'properties.prop': { $gt: 100 } });
    });

    it('should return $gte request', () => {
      const request = sqbuilder._isgt(true, 'prop', true);
      expect(request).toEqual({ 'properties.prop': { $gte: true } });
    });
  });

  describe(SearchQueryBuilderHead.prototype._islt.name, () => {
    it('should return $lt request', () => {
      const request = sqbuilder._islt(100, 'prop');
      expect(request).toEqual({ 'properties.prop': { $lt: 100 } });
    });

    it('should return $lte request', () => {
      const request = sqbuilder._islt(true, 'prop', true);
      expect(request).toEqual({ 'properties.prop': { $lte: true } });
    });
  });

  describe(SearchQueryBuilderHead.prototype._isBetween.name, () => {
    it('should return $gt && $lt request', () => {
      const request = sqbuilder._isBetween(50, 100, 'prop');
      expect(request).toEqual({ 'properties.prop': { $gt: 50, $lt: 100 } });
    });

    it('should return $gte && $lte request', () => {
      const request = sqbuilder._isBetween(50, 100, 'prop', true);
      expect(request).toEqual({ 'properties.prop': { $gte: 50, $lte: 100 } });
    });
  });

  describe(SearchQueryBuilderHead.prototype._getSkip.name, () => {
    it('should return $skip pipeline stage', () => {
      const request = sqbuilder._getSkip(10, 5);
      expect(request).toEqual({ $skip: 50 });
    });
  });

  describe(SearchQueryBuilderHead.prototype._getLimit.name, () => {
    it('should return $limit pipeline stage', () => {
      const request = sqbuilder._getLimit(10);
      expect(request).toEqual({ $limit: 10 });
    });
  });

  describe(SearchQueryBuilderHead.prototype._getSort.name, () => {
    it('should return $sort pipeline stage on prop ', () => {
      const request = sqbuilder._getSort('prop', 1, true);
      expect(request).toEqual({ $sort: { 'prop': 1 } });
    });

    it('should return $sort pipeline stage on properties.prop ', () => {
      const request = sqbuilder._getSort('prop', 1);
      expect(request).toEqual({ $sort: { 'properties.prop': 1 } });
    });
  });

  describe(SearchQueryBuilderHead.prototype._getMultipleSort.name, () => {
    it('should return $sort pipeline stage on prop ', () => {
      const request = sqbuilder._getMultipleSort([{key: 'prop', value: 1}, {key: 'prop1', value: 'desc'}, {key: 'prop2', value: -1}, {key: 'prop3'}]);
      expect(request).toEqual({ $sort: { 'properties.prop': 1, 'properties.prop1': -1, 'properties.prop2': -1, 'properties.prop3': -1} });
    });
  });

  describe(SearchQueryBuilderHead.prototype._queryStringQuery.name, () => {
    it('should return startsWith Elastic request', () => {
      const request = sqbuilder._queryStringQuery(['val1', 'val2'], ['prop1', 'prop2'], 'startsWith');
      expect(request).toEqual([
        {
          query_string: {
            query: `/val1.*/`,
            fields: ['prop1', 'prop2'],
            analyze_wildcard: true,
            escape: false,
            auto_generate_synonyms_phrase_query: false,
            boost: 100,
          },
        }, {
          query_string: {
            query: `/val2.*/`,
            fields: ['prop1', 'prop2'],
            analyze_wildcard: true,
            escape: false,
            auto_generate_synonyms_phrase_query: false,
            boost: 100,
          },
        }
      ]);
    });

    it('should return startsWith Elastic request', () => {
      const request = sqbuilder._queryStringQuery(['val1', 'val2-4'], ['prop1', 'prop2'], 'contains');
      expect(request).toEqual(([
        {
          query_string: {
            query: `/.*val1.*/`,
            fields: ['prop1', 'prop2'],
            analyze_wildcard: true,
            auto_generate_synonyms_phrase_query: false,
            boost: 100,
          },
        }, {
          query_string: {
            query: `/.*val2.*/`,
            fields: ['prop1', 'prop2'],
            analyze_wildcard: true,
            auto_generate_synonyms_phrase_query: false,
            boost: 100,
          },
        }, {
          query_string: {
            query: `/.*4.*/`,
            fields: ['prop1', 'prop2'],
            analyze_wildcard: true,
            auto_generate_synonyms_phrase_query: false,
            boost: 100,
          },
        }
      ]));
    });

    it('should return startsWith Elastic request', () => {
      const request = sqbuilder._queryStringQuery(['val1', 'val2:4'], ['prop1', 'prop2'], 'endWith');
      expect(request).toEqual(([
        {
          query_string: {
            query: `/.*val1/`,
            fields: ['prop1', 'prop2'],
            analyze_wildcard: true,
            escape: false,
            auto_generate_synonyms_phrase_query: false,
            boost: 100,
          },
        }, {
          query_string: {
            query: `/.*val2:4/`,
            fields: ['prop1', 'prop2'],
            analyze_wildcard: true,
            escape: false,
            auto_generate_synonyms_phrase_query: false,
            boost: 100,
          },
        }
      ]));
    });
  });
  
  describe(SearchQueryBuilderHead.prototype.formatDate.name, () => { 
    it('should return formatedDate', () => {
      const request = sqbuilder.formatDate('11/01/2000', 'Date');
      expect(request).toEqual(new Date('11/01/2000'));
    });

    it('should return formatedDate', () => {
      const request = sqbuilder.formatDate(['11/01/2000', '11/01/2020'], 'Date');
      expect(request).toEqual([new Date('11/01/2000'), new Date('11/01/2020')]);
    });

    it('should return formatedDate', () => {
      const request = sqbuilder.formatDate('11/01/2000', 'number');
      expect(request).toEqual('11/01/2000');
    });

    it('should return formatedDate', () => {
      const request = sqbuilder.formatDate(['11/01/2000', '11/01/2020'], 'string');
      expect(request).toEqual(['11/01/2000', '11/01/2020']);
    });
  });

  describe(SearchQueryBuilderHead.prototype.mapCriteraOnsearchTextProperty.name, () => {

    it('should return StartWith regex', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterStartWith.value, [model3, model4]);
      expect(request).toEqual(searchStartsWithRegex);
    });

    it('should return contains regex', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterContains.value, [model3, model4]);
      expect(request).toEqual(searchContainsRegex);
    });

    it('should return endWith regex', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterEndWith.value, [model3, model4]);
      expect(request).toEqual(searchEndsWithRegex);
    });

    it('should return $eq request request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterEquals.value, [model3, model4]);
      expect(request).toEqual(searchequls);
    });

    it('should return $ne request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterDifferent.value, [model3, model4]);
      expect(request).toEqual(searchDifferent);
    });

    it('should return $in request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterisIn.value, [model3, model4]);
      expect(request).toEqual(searchisIn);
    });

    it('should return $gt request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filtergt.value, [model3, model4]);
      expect(request).toEqual({});
    });

    it('should return $lt request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterlt.value, [model3, model4]);
      expect(request).toEqual({});
    });

    it('should return $gte request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filtergte.value, [model3, model4]);
      expect(request).toEqual({});
    });

    it('should return $lte request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterlte.value, [model3, model4]);
      expect(request).toEqual({});
    });

    it('should return $null request request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterisNull.value, [model3, model4]);
      expect(request).toEqual({});
    });

    it('should return $gt && $lt request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterbetween.value, [model3, model4]);
      expect(request).toEqual({});
    });

    it('should return $exists request', () => {
      const request = sqbuilder.mapCriteraOnsearchTextProperty(filterExists.value, [model3, model4]);
      expect(request).toEqual({});
    });

  });

  describe(SearchQueryBuilderHead.prototype.mapCritera.name, () => {

    it('should return StartWith regex', () => {
      const request = sqbuilder.mapCritera(filterStartWith.value, filterStartWith.key as string);
      expect(request).toEqual(startsWithRegex);
    });

    it('should return contains regex', () => {
      const request = sqbuilder.mapCritera(filterContains.value, filterContains.key as string);
      expect(request).toEqual(containsWithRegex);
    });

    it('should return endWith regex', () => {
      const request = sqbuilder.mapCritera(filterEndWith.value, filterEndWith.key as string);
      expect(request).toEqual(endsWithWithRegex);
    });

    it('should return $eq request request', () => {
      const request = sqbuilder.mapCritera(filterEquals.value, filterEquals.key as string);
      expect(request).toEqual(eqRequest);
    });

    it('should return $ne request', () => {
      const request = sqbuilder.mapCritera(filterDifferent.value, filterDifferent.key as string);
      expect(request).toEqual(neRequest);
    });

    it('should return $gt request', () => {
      const request = sqbuilder.mapCritera(filtergt.value, filtergt.key as string);
      expect(request).toEqual(gtRequest);
    });

    it('should return $lt request', () => {
      const request = sqbuilder.mapCritera(filterlt.value, filterlt.key as string);
      expect(request).toEqual(ltRequest);
    });

    it('should return $gte request', () => {
      const request = sqbuilder.mapCritera(filtergte.value, filtergte.key as string);
      expect(request).toEqual(gteRequest);
    });

    it('should return $lte request', () => {
      const request = sqbuilder.mapCritera(filterlte.value, filterlte.key as string);
      expect(request).toEqual(lteRequest);
    });

    it('should return $null request request', () => {
      const request = sqbuilder.mapCritera(filterisNull.value, filterisNull.key as string);
      expect(request).toEqual(nullKey1Request);
    });

    it('should return $in request', () => {
      const request = sqbuilder.mapCritera(filterisIn.value, filterisIn.key as string);
      expect(request).toEqual(inRequest);
    });

    it('should return $gt && $lt request', () => {
      const request = sqbuilder.mapCritera(filterbetween.value, filterbetween.key as string);
      expect(request).toEqual(betWeenRequest);
    });

    it('should return $exists request', () => {
      const request = sqbuilder.mapCritera(filterExists.value, filterExists.key as string);
      expect(request).toEqual(existsRequest);
    });

  });

  describe(SearchQueryBuilderHead.prototype.getUniqueValuesAggregation.name, () => {
    it('should return aggregation pipeline with no Value', () => {
      const request = sqbuilder.getUniqueValuesAggregation('customer', 0, 1, 1, 'model1', 'prop1', null);
      expect(request).toEqual(uniqueValuesAggregationPipeNoValue);
    });

    it('should return aggregation pipeline with statWith regex', () => {
      const request = sqbuilder.getUniqueValuesAggregation('customer', 0, 1, 1, 'model1', 'prop1', 's');
      expect(request).toEqual(uniqueValuesAggregationPipeStarWithValue);
    });

  });

  describe(SearchQueryBuilderHead.prototype.fullTextSearch.name, () => {
    it('should return full contains regex with all properties', () => {
      const request = sqbuilder.fullTextSearch(['model1'], 'weeeeeeeesh');
      expect(request).toEqual({$match: {
        modelKey: { $in: ['model1'] },
        'properties.~__searchtext': /.*weeeeeeeesh.*/i 
      }});
    });
  });

  describe(SearchQueryBuilderHead.prototype.match.name, () => {
    it('should return full contains regex with all properties', () => {
      const request = sqbuilder.match('customer', false, filters, [model1, model2]);
      expect(request).toEqual({ $match });
    });
  });

  describe(SearchQueryBuilderHead.prototype.unwindAndRepalceRoot.name, () => {
    it('should return $facet request with two pipelines', () => {
      const request = sqbuilder.unwindAndRepalceRoot('prop');
      expect(request[0]).toEqual({ $unwind: `$prop` });
      expect(request[1]).toEqual({ $replaceRoot: { newRoot: `$prop` } });
      expect(request[2]).toBeUndefined();
    });
  });

  describe(SearchQueryBuilderHead.prototype.unwindFacets.name, () => {
    it('should return $facet request with two pipelines', () => {
      const request = sqbuilder.unwindFacets([facePipeline1, facePipeline2]);
      expect(request[0]).toEqual({ $project: { common: { $setIntersection: ['$facePipeline1', '$facePipeline2'] } } });
      expect(request[1]).toEqual({ $unwind: `$common` });
      expect(request[2]).toEqual({ $replaceRoot: { newRoot: `$common` } });
      expect(request[3]).toBeUndefined();
    });
  });

  describe(SearchQueryBuilderHead.prototype.facet.name, () => {
    it('should return $facet request with two pipelines', () => {
      const request = sqbuilder.facet([facePipeline1, facePipeline2]);
      expect(request).toEqual({ $facet });
    });
  });

  describe(SearchQueryBuilderHead.prototype.lookUpforParent.name, () => {
    it('should return $lookup to get parent with deleted : true', () => {
      const request = sqbuilder.lookUpforParent('prop', ['model1'], true);
      expect(request[0]).toEqual(ParentlookUp1[0]);
      expect(request[1]).toEqual(ParentlookUp1[1]);
      expect(request[2]).toEqual(ParentlookUp1[2]);
      expect(request[3]).toEqual(ParentlookUp1[3]);
      expect(request[4]).toEqual(ParentlookUp1[4]);
      expect(request[5]).toEqual(ParentlookUp1[5]);
    });

    it('should return $lookup to get parent with deleted : false', () => {
      const request = sqbuilder.lookUpforParent('prop', ['model1'], false);
      expect(request[0]).toEqual(ParentlookUp2[0]);
      expect(request[1]).toEqual(ParentlookUp2[1]);
      expect(request[2]).toEqual(ParentlookUp2[2]);
      expect(request[3]).toEqual(ParentlookUp2[3]);
      expect(request[4]).toEqual(ParentlookUp2[4]);
      expect(request[5]).toEqual(ParentlookUp2[5]);
    });

    it('should return $lookup to get parent with deleted : false', () => {
      const request = sqbuilder.lookUpforParent('prop', ['model1'], false, false);
      expect(request[0]).toEqual(ParentlookUp2[0]);
      expect(request[1]).toEqual(ParentlookUp2[1]);
      expect(request[2]).toEqual(ParentlookUp2[2]);
      expect(request[3]).toEqual(ParentlookUp2[3]);
      expect(request[4]).toBeUndefined();
      expect(request[5]).toBeUndefined();

    });
  });

  describe(SearchQueryBuilderHead.prototype.facetPipelines.name, () => {
    it('should return $facet request with two pipelines', () => {
      const request = sqbuilder.facetPipelines('customer1', true, filtersSubDoc,[model1], [model1, model2]);
     
      expect(request[0].key).toEqual(facetsResutls[0].key);
      expect(request[0].pipeline[0]).toEqual(facetsResutls[0].pipeline[0]);      
      expect(request[0].pipeline[1]).toEqual(facetsResutls[0].pipeline[1]);      
      expect(request[0].pipeline[2]).toEqual(facetsResutls[0].pipeline[2]);      
      expect(request[0].pipeline[3]).toEqual(facetsResutls[0].pipeline[3]);      
      expect(request[0].pipeline[4]).toEqual(facetsResutls[0].pipeline[4]);      
      expect(request[0].pipeline[5]).toEqual(facetsResutls[0].pipeline[5]);      
      expect(request[0].pipeline[6]).toEqual(facetsResutls[0].pipeline[6]);  
      expect(request[0].pipeline[7]).toBeUndefined();  

      expect(request[1].key).toEqual(facetsResutls[1].key);
      expect(request[1].pipeline[0]).toEqual(facetsResutls[1].pipeline[0]);      
      expect(request[1].pipeline[1]).toEqual(facetsResutls[1].pipeline[1]);      
      expect(request[1].pipeline[2]).toEqual(facetsResutls[1].pipeline[2]);      
      expect(request[1].pipeline[3]).toEqual(facetsResutls[1].pipeline[3]);      
      expect(request[1].pipeline[4]).toEqual(facetsResutls[1].pipeline[4]);      
      expect(request[1].pipeline[5]).toEqual(facetsResutls[1].pipeline[5]);      
      expect(request[1].pipeline[6]).toEqual(facetsResutls[1].pipeline[6]);  
      expect(request[1].pipeline[7]).toBeUndefined();  
    });
  });

  describe(SearchQueryBuilderHead.prototype._getKey.name, () => {

    it('should return properties.prop', () => {
      expect(sqbuilder._getKey('prop')).toStrictEqual('properties.prop');
    });

    it('should return updateDate', () => {
      expect(sqbuilder._getKey('sys:updateDate')).toStrictEqual('updateDate');
    });

    it('should return createdDate', () => {
      expect(sqbuilder._getKey('sys:createdDate')).toStrictEqual('createdDate');
    });
    
    it('should return skills.atTag.tags', () => {
      expect(sqbuilder._getKey('sys:tags')).toStrictEqual('skills.atTag.tags');
    });

    it('should return uuid', () => {
      expect(sqbuilder._getKey('uuid')).toStrictEqual('uuid');
    });
  });

  describe(SearchQueryBuilderHead.prototype.setdocQueries.name, () => {

    it('should return docQueries', () => {
      expect(sqbuilder.setdocQueries('algotech', 0, 1, querySO, ['model1'])).toStrictEqual(docQueries);
    });
  });

});