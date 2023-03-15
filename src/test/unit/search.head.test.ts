import { SearchHead, SearchQueryBuilderHead } from "../../providers";
import {
  combined,
  query,
} from "../fixtures/search.head.fixtures";

describe(SearchHead.name, () => {
  let searchHead: SearchHead;
  beforeAll((done) => {
    searchHead = new SearchHead(new SearchQueryBuilderHead(), null, null, null);
    done();
  });

  describe(SearchHead.prototype.combineSysQueries.name, () => {
    it('should combine sysQury object with search', () => {
      let search = 'text1 text2';
      let skip = 10;
      let limit = 11;
      expect(searchHead.combineSysQueries(query, search, skip, limit)).toEqual(combined)
    });
  });
});
