import { _, jinja2 } from './cat.js';
import * as c from './utils.js';
const req=(...args)=>{
    return $fetch(...args).then(res=>{
        return {...res,content:JSON.stringify(res)}
    }).catch(error=>{
      return error
    })
}

function jsonParse(obj) {
    if (typeof obj === 'string') {
      return JSON.parse(obj);
    }
    return obj;
  }



class User {
  driveId = '';
  userId = '';
  tokenType = '';
  accessToken = '';
  refreshToken = '';
  
  static objectFrom(d) {
    if (_.isEmpty(d)) return new User();
    let f = jsonParse(d);
    let user = new User();
    user.driveId = f.default_drive_id;
    user.userId = f.user_id;
    user.tokenType = f.token_type;
    user.accessToken = f.access_token;
    user.refreshToken = f.refresh_token;
    return user;
  }
  
  getDriveId() {
    return _.isEmpty(this.driveId) ? '' : this.driveId;
  }
  
  getUserId() {
    return _.isEmpty(this.userId) ? '' : this.userId;
  }
  
  getTokenType() {
    return _.isEmpty(this.tokenType) ? '' : this.tokenType;
  }
  
  getAccessToken() {
    return _.isEmpty(this.accessToken) ? '' : this.accessToken;
  }
  
  getRefreshToken() {
    return _.isEmpty(this.refreshToken) ? '' : this.refreshToken;
  }
  
  setRefreshToken(d) {
    this.refreshToken = d;
  }
  
  getAuthorization() {
    return this.getTokenType() + ' ' + this.getAccessToken();
  }
  
  isAuthed() {
    return this.getTokenType().length > 0 && this.getAccessToken().length > 0;
  }
  
  clean() {
    this.refreshToken = '';
    this.accessToken = '';
    return this;
  }
  
  async save() {
    return await store.set(this.getRefreshToken(), 'aliyundrive_user', this.toString()), this;
  }

  toString() {
    let d = {
      default_drive_id: this.getDriveId(),
      user_id: this.getUserId(),
      token_type: this.getTokenType(),
      access_token: this.getAccessToken(),
      refresh_token: this.getRefreshToken()
    };
    return JSON.stringify(d);
  }
}

class OAuth {
  tokenType = '';
  accessToken = '';
  refreshToken = '';

  static objectFrom(d) {
    if (_['isEmpty'](d)) return new OAuth();
    
    let f = jsonParse(d);
    let g = new OAuth();
    
    g.tokenType = f.token_type;
    g.accessToken = f.access_token;
    g.refreshToken = f.refresh_token;
    
    return g;
  }

  getTokenType() {
    return _['isEmpty'](this.tokenType) ? '' : this.tokenType;
  }

  getAccessToken() {
    return _['isEmpty'](this.accessToken) ? '' : this.accessToken;
  }

  getRefreshToken() {
    return _['isEmpty'](this.refreshToken) ? '' : this.refreshToken;
  }

  getAuthorization() {
    return this.getTokenType() + ' ' + this.getAccessToken();
  }

  clean() {
    this.refreshToken = '';
    this.accessToken = '';
    return this;
  }

  async save() {
    await store.set(this.getRefreshToken(), 'aliyundrive_oauth', this.toString());
    return this;
  }

  toString() {
    var d = {
      'token_type': this.getTokenType(),
      'access_token': this.getAccessToken(),
      'refresh_token': this.getRefreshToken()
    };
    return JSON.stringify(d);
  }
}

class Item {
  items = [];
  nextMarker = '';
  fileId = '';
  shareId = '';
  name = '';
  type = '';
  fileExtension = '';
  category = '';
  size = '';
  parent = '';

  constructor(d) {
    this.fileId = d;
  }

  static objectFrom(d) {
    if (_.isEmpty(d)) 
      return new Item();
      
    let f = jsonParse(d);
    let g = new Item();
    g.nextMarker = typeof f.next_marker == 'undefined' ? '' : f.next_marker;
    g.fileId = typeof f.file_id == 'undefined' ? '' : f.file_id;
    g.shareId = typeof f.share_id == 'undefined' ? '' : f.share_id;
    g.name = typeof f.name == 'undefined' ? '' : f.name;
    g.type = typeof f.type == 'undefined' ? '' : f.type;
    g.fileExtension = typeof f.file_extension == 'undefined' ? '' : f.file_extension;
    g.category = typeof f.category == 'undefined' ? '' : f.category;
    g.size = typeof f.size == 'undefined' ? '' : f.size;
    g.parent = typeof f.parent_file_id == 'undefined' ? '' : f.parent_file_id;
    
    if(typeof f.items != 'undefined' && Array.isArray(f.items) && !_.isEmpty(f.items)) {
      f.items.forEach(function (h) {
        let i = Item.objectFrom(JSON.stringify(h));
        g.items.push(i);
      });
    }
    
    return g;
  }

  getItems() {
    return _.isEmpty(this.items) ? [] : this.items;
  }

  getNextMarker() {
    return _.isEmpty(this.nextMarker) ? '' : this.nextMarker;
  }

  getFileId() {
    return _.isEmpty(this.fileId) ? '' : this.fileId;
  }

  getName() {
    return _.isEmpty(this.name) ? '' : this.name;
  }

  getType() {
    return _.isEmpty(this.type) ? '' : this.type;
  }

  getExt() {
    return _.isEmpty(this.fileExtension) ? '' : this.fileExtension;
  }

  getCategory() {
    return _.isEmpty(this.category) ? '' : this.category;
  }

  getSize() {
    return this.size == 0x0 ? '' : '[' + c.getSize(this.size) + ']';
  }

  getParent() {
    return _.isEmpty(this.parent) ? '' : '[' + this.parent + ']';
  }

  parentFunc(d) {
    this.parent = d;
    return this;
  }

  getDisplayName() {
    return this.getParent() + ' ' + this.getName() + ' ' + this.getSize();
  }
}

class Code {
  redirectUri = '';

  static objectFrom(data) {
    if (_.isEmpty(data)) {
      return new Code();
    }
    const parsedData = JSON.parse(data);
    const codeObject = new Code();
    codeObject.redirectUri = parsedData.redirectUri;
    return codeObject;
  }

  getRedirectUri() {
    return _.isEmpty(this.redirectUri) ? '' : this.redirectUri;
  }

  constructor() {}
  
  getCode() {
    return this.getRedirectUri().split('code=')[1];
  }
}

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
const CLIENT_ID = '76917ccccd4441c39457a04f6084fb2f';
let quality = {};
let tempIds = [];
let refreshToken = '';
let shareToken = '';
let shareId = '';
let oauth = new OAuth();
let user = new User();
let log = c['log'];

async function getUserCache() {
  const cache = await store.get(user.getRefreshToken(), 'aliyundrive_user');
  return cache;
}

async function getOAuthCache() {
  const cache = await store.get(oauth.getRefreshToken(), 'aliyundrive_oauth');
  return cache;
}

async function initSome() {
  tempIds = [];
  const oauthCache = await getOAuthCache();
  oauth = await OAuth.objectFrom(oauthCache);
  const userCache = await getUserCache();
  user = await User.objectFrom(userCache);
  quality = {
    '4K': 'UHD',
    '2k': 'QHD',
    '超清': 'FHD',
    '高清': 'HD',
    '标清': 'SD',
    '流畅': 'LD'
  };
}

async function setShareId(id) {
  if (getOAuthCache().length === 0) {
    await oauth.clean().save();
  }
  if (getUserCache().length === 0) {
    await user.clean().save();
  }
  shareId = id;
  await refreshShareToken();
}

function getHeader() {
  return {
    'User-Agent': UA,
    'Referer': 'https://www.aliyundrive.com/'
  };
}

function getHeaderAuth() {
  let headers = {
    'x-share-token': shareToken,
    'X-Canary': 'client=Android,app=adrive,version=v4.3.1'
  };
  if (user.isAuthed()) {
    headers['authorization'] = user.getAuthorization();
  }
  return headers;
}

function getHeaderOpen() {
  return {
    'authorization': oauth.getAuthorization()
  };
}


async function alist(d, e) {
  const g = 'https://api-cf.nn.ci/alist/ali_open/' + d;
  const h = await postJson(g, e, getHeader());
  const i = h.content;
  if (await isManyRequest(i)) return false;
  oauth = await OAuth.objectFrom(i).save();
  return true;
}

async function getString(d) {
  const f = await req(d, {});
  return f.content;
}

async function postJson(d, e, f) {
  f['Content-Type'] = 'application/json';
  const h = await req(d, {
    headers: f,
    method: 'post',
    data: e,
    body: e
  });
  return h;
}

async function post(d, e) {
  if (!d.startsWith('https')) {
    d = 'https://api.aliyundrive.com/' + d;
  }
  const g = await postJson(d, e, getHeader());
  return g.content;
}

async function auth(d, e, f) {
  if (!d.startsWith('https')) {
    d = 'https://api.aliyundrive.com/' + d;
  }
  let h = await postJson(d, e, getHeaderAuth());
  if (
    f && (
      h.code == 0x190 || h.code == 0x191 || typeof h.code == 'undefined' || _.isEmpty(h.content)
    ) &&
    (await refreshAccessToken())
  ) {
    return await auth(d, e, false);
  }
  if (f && (h.code == 0x1ad || typeof h.code == 'undefined')) {
    return await auth(d, e, false);
  }
  return h.content;
}

async function oauthFunc(urlPath, postBody, checkToken = true) {
  urlPath = urlPath.startsWith('https') ? urlPath : `https://open.aliyundrive.com/adrive/v1.0/${urlPath}`;

  await refreshOpenToken();
  const response = await postJson(urlPath, postBody, getHeaderOpen());
  console.log("🚀 ~ oauthFunc ~ response:", response)


  if (checkToken && (response.code === 0x190 || response.code === 0x191 || !response.code || _.isEmpty(response.content)) && (await refreshOpenToken())) {
    return await oauthFunc(urlPath, postBody, false);
  }

  return response.content;
}

async function isManyRequest(messageContent) {
  if (!messageContent.includes('Too Many Requests')) return false;
  return await oauth.clean().save(), true;
}

async function refreshShareToken() {
  try {
    const postObj = { share_id: shareId, share_pwd: '' };
    const tokenJson = await post('v2/share_link/get_share_token', postObj);
    const tokenResponse = jsonParse(tokenJson);
    shareToken = tokenResponse.share_token;
  } catch (error) {
    console.log(error.message);
  }
}

async function refreshAccessToken() {
  try {
    let refreshTokenValue = user.getRefreshToken() || refreshToken;
    
    if (refreshTokenValue.startsWith('http')) {
      refreshTokenValue = await getString(refreshTokenValue);
      refreshTokenValue = refreshTokenValue.trim();
    }

    const requestBody = { refresh_token: refreshTokenValue, grant_type: 'refresh_token' };

    const tokenJson = await post('https://auth.aliyundrive.com/v2/account/token', requestBody);
    
    user = await User.objectFrom(tokenJson).save();


    if (_.isEmpty(user.getAccessToken())) throw new Error(tokenJson);
    return true;
  } catch (error) {
    await log(`refreshAccessToken---error-${error.message}`);
    await user.clean().save();
    return true;
  }
}

async function oauthRequest() {
  try {
    const params = {
      authorize: 0x1,
      scope: 'user:base,file:all:read,file:all:write'
    };

    const url = `https://open.aliyundrive.com/oauth/users/authorize?client_id=${CLIENT_ID}&redirect_uri=https://alist.nn.ci/tool/aliyundrive/callback&scope=user:base,file:all:read,file:all:write&state=`;

    const authResult = await auth(url, params, true);


    
    return await oauthRedirect(Code.objectFrom(authResult).getCode());
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function oauthRedirect(d) {
  try {
    const g = {
      code: d, 
      grant_type: 'authorization_code'
    };
    return await alist('code', g);
  } catch (h) {
    await oauth.clean().save();
    return false;
  }
}

async function refreshOpenToken() {
  try {
    if (_.isEmpty(oauth.getRefreshToken())) return await oauthRequest();
  
    const f = {
      grant_type: 'refresh_token', 
      refresh_token: oauth.getRefreshToken()
    };
    return await alist('token', f);
  } catch (g) {
    oauth.clean().save();
    return false;
  }
}

async function getVod(d, e) {
  const g = { share_id: shareId };
  const h = await post('adrive/v3/share_link/get_share_by_anonymous', g);
  const j = jsonParse(h);
  const k = [], l = [];
  const m = getParentFileId(e, j);
  
  await listFiles(new Item(m), k, l);
  
  const o = ['原画', '超清', '高清'];
  const p = k.map(r => `${r.getDisplayName()}$${r.getFileId()}${findSubs(r.getName(), l)}`);
  const q = new Array(o.length).fill(p.join('#'));
  
  return {
    vod_id: d,
    vod_content: d,
    vod_pic: j.avatar,
    vod_name: j.share_name,
    vod_play_url: q.join('$$$'),
    vod_play_from: o.join('$$$'),
    type_name: '阿里云盘',
    vod_year: '',
    vod_area: '',
    vod_remarks: '',
    vod_actor: '',
    vod_director: ''
  };
}

async function listFiles(d, e, f) {
  return await listFilesMarker(d, e, f, '');
}

async function listFilesMarker(d, e, f, g) {
  const i = {
    limit: 0xc8,
    share_id: shareId,
    parent_file_id: d.getFileId(),
    order_by: 'name',
    order_direction: 'ASC',
    marker: g.length > 0x0 ? g : undefined
  }

  const k = Item.objectFrom(await auth('adrive/v3/file/list', i, true));
  const j = [];
  
  for (const l of k.getItems()) {
    if (l.getType() == 'folder')
      j.push(l);
    else if (l.getCategory() == 'video' || l.getCategory() == 'audio')
      e.push(l.parentFunc(d.getName()));
    else if (c.isSub(l.getExt()))
      f.push(l);
  }
  
  if (k.getNextMarker().length > 0x0) 
    await listFilesMarker(d, e, f, k.getNextMarker());
  
  for (const m of j) 
    await listFiles(m, e, f);
}

function getParentFileId(data, otherData) {
  let fileInfos = otherData.file_infos;
  if (!_.isEmpty(data)) return data;
  if (fileInfos.length === 0) return '';
  let firstInfo = fileInfos[0];
  if (firstInfo.type === 'folder') return firstInfo.file_id;
  if (firstInfo.type === 'file' && firstInfo.category === 'video') return 'root';
  return '';
}

function pair(name, list, arrayToFill) {
  for (let h of list) {
    let fName = c.removeExt(h.getName()).toLowerCase();
    if (name.includes(fName) || fName.includes(name)) arrayToFill.push(h);
  }
}

function findSubs(fileName, list) {
  let g = [];
  pair(c.removeExt(fileName).toLowerCase(), list, g);
  if (g.length === 0) g = [...list];
  let result = g.map(item => '+' + c.removeExt(item.getName()) + '@@@' + item.getExt() + '@@@' + item.getFileId()).join("");
  return result;
}

async function getSubs(list) {
  return list.filter(item => item.includes('@@@'))
              .map(item => 'proxy://sub/' + item.split('@@@')[2]);
}

async function getDownloadUrl(id) {
  tempIds.unshift(await copy(id));
  let postBody = {
    file_id: tempIds[0],
    drive_id: user.getDriveId()
  };
  let response = await oauthFunc('openFile/getDownloadUrl', postBody, true);
  await deleteAll();
  return jsonParse(response).url;
}

async function getVideoPreviewPlayInfo(id) {
  tempIds.unshift(await copy(id));
  let postBody = {
    file_id: tempIds[0],
    drive_id: user.getDriveId(),
    category: 'live_transcoding',
    url_expire_sec: '14400'
  };
  let response = await oauthFunc('openFile/getVideoPreviewPlayInfo', postBody, true);
  await deleteAll();
  return jsonParse(response).video_preview_play_info;
}

async function playerContent(idList) {
  let downloadUrl = await getDownloadUrl(idList[0]);
  let subs = await getSubs(idList);
  return JSON.stringify({
    parse: 0,
    url: downloadUrl,
    header: getHeader(),
    subt: subs
  });
}

async function playerContentByFlag(d, e) {
  let g = await getVideoPreviewPlayInfo(d[0x0]);
  let h = getPreviewUrl(g, e);
  let i = await getSubs(d);
  let j = getSubsByPlayInfo(g);
  for (var k of j) {
    i.push(k);
  }
  return JSON.stringify({
    'parse': 0x0,
    'url': h,
    'header': getHeader(),
    'subt': i
  });
}

function getPreviewUrl(d, e) {
  if (!d.hasOwnProperty('live_transcoding_task_list')) return '';
  let g = d.live_transcoding_task_list;
  for (var h = 0x0; h < g.length; ++h) {
    let j = g[h];
    if (j.template_id == quality[e]) return j.url;
  }
  return g[0x0].url;
}

function getSubsByPlayInfo(d) {
  if (!d.hasOwnProperty('live_transcoding_subtitle_task_list')) return [];
  let f = d.live_transcoding_subtitle_task_list;
  let g = [];
  for (var h = 0x0; h < f.length; ++h) {
    let j = f[h];
    let k = j.language;
    let l = j.url;
    g.push(l);
  }
  return g;
}

async function copy(d) {
  let f = '{"requests":[{"body":{"file_id":"{{data.fileId}}","share_id":"{{data.shareId}}","auto_rename":true,"to_parent_file_id":"root","to_drive_id":"{{data.driveId}}"},"headers":{"Content-Type":"application/json"},"id":"0","method":"POST","url":"/file/copy"}],"resource":"file"}';
  let g = {
    'fileId': d,
    'shareId': shareId,
    'driveId': user.getDriveId()
  };
  f = jinja2(f, {
    'data': g
  });
  let h = await auth('adrive/v2/batch', jsonParse(f), true);
  if (h.indexOf('ForbiddenNoPermission.File') > -0x1) return copy(d);
  return jsonParse(h).responses[0x0].body.file_id;
}

async function deleteAll() {
  let e = tempIds;
  for (var f of e) {
    let g = await deleteFile(f);
    if (g) tempIds = e.filter(h => h !== f);
  }
}

async function deleteFile(fileId) {
  let requestTemplate = '{"requests":[{"body":{"drive_id":"{{data.driveId}}","file_id":"{{data.fileId}}"},"headers":{"Content-Type":"application/json"},"id":"{{data.fileId}}","method":"POST","url":"/file/delete"}],"resource":"file"}';

  let requestData = {
      'fileId': fileId,
      'driveId': user.getDriveId()
  };

  let request = jinja2(requestTemplate, {
      'data': requestData
  });

  let response = await auth('adrive/v2/batch', jsonParse(request), true);

  return response.length == 0xd3;
}

async function setToken(refreshToken) {
  user.setRefreshToken(refreshToken);
  await refreshAccessToken();
}

export { initSome, setToken, setShareId, getVod, playerContent, playerContentByFlag };