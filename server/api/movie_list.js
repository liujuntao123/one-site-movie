import { objectToQueryString } from './utils/common';
import { base_url, common_header } from './utils/douban_common';
import urlConfig from './utils/douban_url_config';
import common_query from './utils/douban_query_config';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = urlConfig[query.key];
  const url = `${base_url}${path}`;
  let commonQueryKey = query.key;

  const queryObj = common_query[commonQueryKey];
  const queryString = objectToQueryString({ ...queryObj, q: query.q, start: query.start, count: query.count });
  const res = await $fetch(`${url}?${queryString}`, {
    method: 'GET',
    headers: { ...common_header },
  });
  return {
    status: 'success',
    data: res,
  };
});
