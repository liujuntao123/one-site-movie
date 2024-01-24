import { __jsEvalReturn } from '../source/pansearch_open';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const headers = getHeaders(event);

  var spider = __jsEvalReturn();

  function jsonParse(obj) {
    if (typeof obj === 'string') {
      return JSON.parse(obj);
    }
    return obj;
  }

  await spider.init({ skey: 'siteKey', ext: headers['ali-token'] });

  var result = jsonParse(await spider.play(query.flag, query.url, query.share_id));
  return { status: result ? 'success' : 'failed', data: result };
});
