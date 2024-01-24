import { _ } from './cat.js';
import { log } from './utils.js';
import { initSome, setToken, setShareId, getVod, playerContent, playerContentByFlag } from './ali_api_readable.js';

async function initAli(c) {
  let e = c['ext'];

  await log('ali init:' + typeof c);
  await initSome();
  await setToken(e);
  await log('ali init ext:' + e);
}

async function detailContent(c) {
  const e = /www.aliyundrive.com\/s\/([^\/]+)(\/folder\/([^\/]+))?/;
  let f = c['trim']();
  let g = f['match'](e);

  if (_['isEmpty'](g)) return '';

  let fileId = g[1];
  let folderId = g.length == 3 ? g[3] : '';

  await setShareId(fileId);

  let vodInfo = await getVod(f, folderId);
  let stringifyInfo = JSON.stringify({ list: [vodInfo] });

  return stringifyInfo;
}

async function playContent(c, d, sharedUrl) {
  const e = /www.aliyundrive.com\/s\/([^\/]+)(\/folder\/([^\/]+))?/;
  let trimedStr = sharedUrl['trim']();
  const matchedArray = trimedStr['match'](e);

  if (_['isEmpty'](matchedArray)) return '';

  let shareId = matchedArray[1];

  await setShareId(shareId);
  let clarity = d['split']('+');
  let content = c == '原画' ? await playerContent(clarity) : await playerContentByFlag(clarity, c);

  return content;
}

export { initAli, detailContent, playContent };
