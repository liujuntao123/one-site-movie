import { __jsEvalReturn as pansearch } from '../source/pansearch_open';
import { __jsEvalReturn as wogg } from '../source/wogg_open';
import { __jsEvalReturn as dovx } from '../source/dovx_open';
import { __jsEvalReturn as pansou } from '../source/pansou_open';
import { __jsEvalReturn as xiaozhitiao } from '../source/xiaozhitiao_open';

const engines = {
  pansearch,
  wogg,
  dovx,
  pansou,
  xiaozhitiao,
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const headers = getHeaders(event);
  const engineHeader = headers['search-engine'];
  console.log('🚀 ~ defineEventHandler ~ engineHeader:', engineHeader);

  const engine = engines[engineHeader];

  var spider = engine();

  function jsonParse(obj) {
    if (typeof obj === 'string') {
      return JSON.parse(obj);
    }
    return obj;
  }

  var result = jsonParse(await spider.search(query.keywords));

  return { status: 'success', data: result };
});
