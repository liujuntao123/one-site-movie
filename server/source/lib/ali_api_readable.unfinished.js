import { _, jinja2 } from './cat.js';
import * as c from './utils.js';

const req = (...args) => {
    return $fetch(...args).then(res => {
        console.log("🚀 ~ returnglobal._request ~ res:", res)
        return {...res, content: JSON.stringify(res)}
    })
}

function jsonParse(obj) {
    if (typeof obj === 'string') {
      return JSON.parse(obj);
    }
    return obj;
}

const local = {
    set: async (path1, path2, val) => {
      global.store.set(`${path1}/${path2}`, JSON.stringify(val))
    },
    get: async (path1, path2) => {
      return jsonParse(global.store.get(`${path1}/${path2}`))
    }
}

class User {
  driveId = '';
  id = '';
  tokenType = '';
  access = '';
  refreshToken = '';

  static fromObject(data) {
    if (_.isEmpty(data)) return new User();
    let parsedData = jsonParse(data);
    let newUser = new User();
    
    newUser.driveId = parsedData.default_drive_id;
    newUser.id = parsedData.user_id;
    newUser.tokenType = parsedData.token_type;
    newUser.access = parsedData.access_token;
    newUser.refreshToken = parsedData.refresh_token;
    
    return newUser;
  }

  constructor() {}

  checkValue(value) {
    return _.isEmpty(value) ? '' : value;
  }

  getDriveId() {
    return this.checkValue(this.driveId);
  }
  
  getId() {
    return this.checkValue(this.id);
  }

  setRefreshToken(token) {
    this.refreshToken = token;
  }
  
  getAuthorization() {
    return this.getTokenType() + ' ' + this.getAccess();
  }
  
  isAuthenticated() {
    return this.getTokenType().length > 0 && this.getAccess().length > 0;
  }
  
  clear() {
    this.refreshToken = '';
    this.access = '';
    return this;
  }

  async save() {
    await local.set('ali', 'aliyundrive_user', this.toString());
    return this;
  }
  
  toString() {
    let data = {
      default_drive_id: this.getDriveId(),
      user_id: this.getId(),
      token_type: this.getTokenType(),
      access_token: this.getAccess(),
      refresh_token: this.getRefreshToken(),
    };
    return JSON.stringify(data);
  }
}


class OAuth {
  constructor() {
    this.tokenType = '';
    this.accessToken = '';
    this.refreshToken = '';
  }
  
  static fromObject(data) {
    console.log('OAuth fromObject ----- ');
    console.log(data);
    if (_.isEmpty(data)) {
      return new OAuth();
    }
    
    const parsedData = JSON.parse(data);
    const oauth = new OAuth();
    oauth.tokenType = parsedData.token_type;
    oauth.accessToken = parsedData.access_token;
    oauth.refreshToken = parsedData.refresh_token;
    return oauth;
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
  
  getAuthorization() {
    return this.getTokenType() + ' ' + this.getAccessToken();
  }
  
  // clean() {
  //   this.refreshToken = '';
  //   this.accessToken = '';
  //   return this;
  // }
  
  // async save() {
  //   await local.set('ali', 'aliyundrive_oauth', this.toString());
  //   return this;
  // }
  
  toString() {
    const data = {
      token_type: this.getTokenType(),
      access_token: this.getAccessToken(),
      refresh_token: this.getRefreshToken()
    };
    return JSON.stringify(data);
  }
}


class Item {
  constructor() {
    this.items = [];
    this.nextMarker = '';
    this.fileId = '';
    this.shareId = '';
    this.name = '';
    this.type = '';
    this.fileExtension = '';
    this.category = '';
    this.size = '';
    this.parent = '';
    this.fileId = fileId;
  }


  static fromObject(data) {
    if (_.isEmpty(data)) {
      return new Item();
    }

    const parsedData = JSON.parse(data);
    const item = new Item();
    item.nextMarker = parsedData.next_marker ?? '';
    item.fileId = parsedData.file_id ?? '';
    item.shareId = parsedData.share_id ?? '';
    item.name = parsedData.name ?? '';
    item.type = parsedData.type ?? '';
    item.fileExtension = parsedData.file_extension ?? '';
    item.category = parsedData.category ?? '';
    item.size = parsedData.size ?? '';
    item.parent = parsedData.parent_file_id ?? '';

    if (Array.isArray(parsedData.items) && !_.isEmpty(parsedData.items)) {
      parsedData.items.forEach((itemData) => {
        const subItem = Item.fromObject(JSON.stringify(itemData));
        item.items.push(subItem);
      });
    }

    return item;
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

  getExtension() {
    return _.isEmpty(this.fileExtension) ? '' : this.fileExtension;
  }

  getCategory() {
    return _.isEmpty(this.category) ? '' : this.category;
  }

  getSize() {
    return this.size === '0x0' ? '' : '[' + c.getSize(this.size) + ']';
  }

  getParent() {
    return _.isEmpty(this.parent) ? '' : '[' + this.parent + ']';
  }

  setParent(parent) {
    this.parent = parent;
    return this;
  }

  getDisplayName() {
    return this.getParent() + ' ' + this.getName() + ' ' + this.getSize();
  }
}


class Code {
  constructor() {
    this.redirectUri = '';
  }

  static fromJson(json) {
    if (!json) {
      return new Code();
    }

    const parsedJson = JSON.parse(json);
    const code = new Code();
    code.redirectUri = parsedJson.redirectUri;
    return code;
  }

  getRedirectUri() {
    return this.redirectUri || '';
  }

  getCode() {
    return this.getRedirectUri().split('code=')[1];
  }
}

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
  CLIENT_ID = '76917ccccd4441c39457a04f6084fb2f';
let quality = {},
  tempIds = [],
  refreshToken = '',
  shareToken = '',
  shareId = '',
  oauth = new OAuth(),
  user = new User(),
  log = c['log'];
  
  async function getUserCache() {
    
    return auth.ali.aliyundrive_user
  }
  
  async function getOAuthCache() {
    return auth.ali.aliyundrive_oauth
  }
  
  async function initSome(auth) {
    tempIds = [];
    const oauthCache = await getOAuthCache(auth);
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
    // if (getOAuthCache().length === 0) {
    //   await oauth.clean().save();
    // }
    // if (getUserCache().length === 0) {
    //   await user.clean().save();
    // }
    shareId = id;
    await refreshShareToken();
  }
  
  function getHeader() {
    const headers = {};
    headers['User-Agent'] = UA;
    headers['Referer'] = 'https://www.aliyundrive.com/';
    return headers;
  }
  
  function getHeaderAuth() {
    const headers = {};
    console.log('>>>>>>>>>',refreshToken)
    headers['x-share-token'] = shareToken;
    headers['X-Canary'] = 'client=Android,app=adrive,version=v4.3.1';
    if (user.isAuthed()) {
      headers['authorization'] = user.getAuthorization();
    }
    console.log("🚀 ~ getHeaderAuth ~ headers:", headers)
    return headers;
  }
  
  function getHeaderOpen() {
    const headers = {};
    console.log('getHeaderOpen---');
    console.log(oauth);
    headers['authorization'] = oauth.getAuthorization();
    return headers;
  }
  
 
  
  async function getString(url) {
    const response = await req(url, {});
    return response.content;
  }
  
  async function postJson(url, data, headers) {
    headers['Content-Type'] = 'application/json';
    const response = await req(url, {
      headers,
      method: 'post',
      // data,
      body: data
    });
    return response;
  }
  
  async function post(url, data) {
    url = url.startsWith('https') ? url : 'https://api.aliyundrive.com/' + url;
    const response = await postJson(url, data, getHeader());
    return response.content;
  }
  
  async function auth(url, data, shouldRetry = true) {
    url = url.startsWith('https') ? url : 'https://api.aliyundrive.com/' + url;
  
    const response = await postJson(url, data, getHeaderAuth());
    await log('auth--res--' + response.content);
  
    // if (
    //   shouldRetry &&
    //   (response.code === 0x190 ||
    //     response.code === 0x191 ||
    //     typeof response.code === 'undefined' ||
    //     _.isEmpty(response.content)) &&
    //   (await refreshAccessToken())
    // ) {
    //   await log('auth--res--400' + response.content);
    //   return await auth(url, data, false);
    // }
  
    // if (
    //   shouldRetry &&
    //   (response.code === 0x1ad || typeof response.code === 'undefined')
    // ) {
    //   await log('auth--res--429' + response.content);
    //   return await auth(url, data, false);
    // }
  
    return response.content;
  }
  
  async function oauthFunc(url, data, shouldRetry = true) {
    url = url.startsWith('https')
      ? url
      : 'https://open.aliyundrive.com/adrive/v1.0/' + url;
  
    const response = await postJson(url, data, getHeaderOpen());
    await log('oauthFunc--res' + JSON.stringify(response));
  
    // if (
    //   shouldRetry &&
    //   (response.code === 0x190 ||
    //     response.code === 0x191 ||
    //     typeof response.code === 'undefined' ||
    //     _.isEmpty(response.content)) &&
    //   (await refreshOpenToken())
    // ) {
    //   await log('retry oauthFunc' );
    //   return await oauthFunc(url, data, false);
    // }
  
    return response.content;
  }
  
  async function isManyRequest(content) {
    if (!(content.indexOf('Too Many Requests') > -1)) {
      return false;
    }
    // await oauth.clean().save();
    return true;
  }
  
  async function refreshShareToken() {
    try {
      const requestData = {};
      requestData.share_id = shareId;
      requestData.share_pwd = '';
      const response = await post('v2/share_link/get_share_token', requestData);
      const parsedResponse = jsonParse(response);
      shareToken = parsedResponse.share_token;
    } catch (error) {
      console.log(error.message);
    }
  }
  
  // async function refreshAccessToken() {
  //   try {
  //     const requestData = {};
  //     let refreshTokenValue = user.getRefreshToken();
  //     _.isEmpty(refreshTokenValue) && (refreshTokenValue = refreshToken);
  //     refreshTokenValue.startsWith('http') &&
  //       (refreshTokenValue = await getString(refreshTokenValue));
  //     refreshTokenValue = refreshTokenValue.trim();
  //     requestData.refresh_token = refreshTokenValue;
  //     requestData.grant_type = 'refresh_token';
  //     await log('refreshAccessToken---body--' + JSON.stringify(requestData));
  //     const response = await post(
  //       'https://auth.aliyundrive.com/v2/account/token',
  //       requestData
  //     );
  //     await log('refreshAccessToken---result--' + response);
  //     user = await User.objectFrom(response).save();
  //     await log('refreshAccessToken---' + user.getDriveId());
  //     if (_.isEmpty(user.getAccessToken())) {
  //       throw new Error(response);
  //     }
  //     return true;
  //   } catch (error) {
  //     await log('refreshAccessToken---error-' + error.message);
  //     console.log(error.message);
  //     // await user.clean().save();
  //     return true;
  //   }
  // }
  async function getUserToken(_token,_shareId) {
    await setToken(_token)
    await setShareId(_shareId)
    try {
      const requestData = {};
      let refreshTokenValue = user.getRefreshToken();
      _.isEmpty(refreshTokenValue) && (refreshTokenValue = global.refreshToken);
      refreshTokenValue.startsWith('http') &&
        (refreshTokenValue = await getString(refreshTokenValue));
      refreshTokenValue = refreshTokenValue.trim();
      requestData.refresh_token = refreshTokenValue;
      requestData.grant_type = 'refresh_token';
      await log('refreshAccessToken---body--' + JSON.stringify(requestData));
      const response = await post(
        'https://auth.aliyundrive.com/v2/account/token',
        requestData
      );
      await log('refreshAccessToken---result--' + response);
      return response;
    } catch (error) {
      await log('refreshAccessToken---error-' + error.message);
      
    }
  }


  
  async function oauthRequest() {
    try {
      const requestData = {};
      requestData.authorize = 0x1;
      requestData.scope = 'user:base,file:all:read,file:all:write';
      console.log("🚀 ~ oauthRequest ~ requestData:", requestData)
      const url =
        'https://open.aliyundrive.com/oauth/users/authorize?client_id=' +
        CLIENT_ID +
        '&redirect_uri=https://alist.nn.ci/tool/aliyundrive/callback&scope=user:base,file:all:read,file:all:write&state=';
        
      const response = await auth(url, requestData, true);
      await log('oauthRequest---' + response);

      return response
          } catch (error) {
      console.error(error);
      return false;
    }
  }


  async function getOpenToken(endpoint, data) {
    const url = `https://api-cf.nn.ci/alist/ali_open/${endpoint}`;
    const response = await postJson(url, data, getHeader());
    const content = response.content;
    console.log("🚀 ~ getOpenToken ~ content:", content)
    if (await isManyRequest(content)) {
      return null;
    }
    return content
  }

  async function getRefreshToken(){
    const requestData = {};
      requestData.grant_type = 'refresh_token';
      requestData.refresh_token = oauth.getRefreshToken();
      const res= await getOpenToken('token', requestData);
      return res
  }
  
  async function oauthRedirect(code) {
    try {
      const requestData = {};
      requestData.code = code;
      requestData.grant_type = 'authorization_code';
      const res=await getOpenToken('code', requestData);
      oauth = await OAuth.fromObject(res)
      return true
    } catch (error) {
      console.log(error.message);
      // await oauth.clean().save();
      return false;
    }
  }

  async function getOAuthToken(_token,_shareId){
    await setToken(_token)
    await setShareId(_shareId)
    const authRes= await oauthRequest();
        const code=Code.fromJson(authRes).getCode()
        await oauthRedirect(code)
        const res=await getRefreshToken()
      return res
  }
  
  async function refreshOpenToken() {
    try {
      if (_.isEmpty(oauth.getRefreshToken())) {
        const authRes= await oauthRequest();
        const code=Code.objectFrom(authRes).getCode()
        await oauthRedirect(code)
      }
      const res=await getRefreshToken()
      oauth = await OAuth.fromObject(res)
    } catch (error) {
      console.log(error.message);
      // oauth.clean().save();
      return false;
    }
  }
  
  async function getVod(shareId, vodId) {
    let shareData = {};
    shareData['share_id'] = shareId;
    let shareResponse = await post('adrive/v3/share_link/get_share_by_anonymous', shareData);
    let shareInfo = jsonParse(shareResponse);
    let fileIds = [];
    let subtitles = [];
    let parentFileId = getParentFileId(vodId, shareInfo);
    let parentItem = new Item(parentFileId);
    await listFiles(parentItem, fileIds, subtitles);
    let qualities = ['原画', '超清', '高清'];
    let playUrls = [];
    for (var file of fileIds) {
      playUrls.push(file['getDisplayName']() + ' + ' + file['getFileId']() + findSubs(file['getName'](), subtitles));
    }
    let playFrom = [];
    for (var i = 0; i < qualities.length; i++) {
      playFrom.push(playUrls.join('#'));
    }
    let vodData = {
      'vod_id': vodId,
      'vod_content': vodId,
      'vod_pic': shareInfo['avatar'],
      'vod_name': shareInfo['share_name'],
      'vod_play_url': playFrom.join('$'),
      'vod_play_from': qualities.join('$'),
      'type_name': '阿里云盘',
      'vod_year': '',
      'vod_area': '',
      'vod_remarks': '',
      'vod_actor': '',
      'vod_director': ''
    };
    return vodData;
  }
  
  async function listFiles(item, fileIds, subtitles) {
    return await listFilesMarker(item, fileIds, subtitles, '');
  }
  
  async function listFilesMarker(item, fileIds, subtitles, marker) {
    let params = {};
    let subItems = [];
    params['limit'] = 200;
    params['share_id'] = shareId;
    params['parent_file_id'] = item['getFileId']();
    params['order_by'] = 'name';
    params['order_direction'] = 'ASC';
    if (marker.length > 0) {
      params['marker'] = marker;
    }
    let response = await auth('adrive/v3/file/list', params, true);
    let itemList = Item['objectFrom'](response);
    for (var file of itemList['getItems']()) {
      if (file['getType']() == 'folder') {
        subItems.push(file);
      } else {
        if (file['getCategory']() == 'video' || file['getCategory']() == 'audio') {
          fileIds.push(file['parentFunc'](item['getName']()));
        } else if (c['isSub'](file['getExt']())) {
          subtitles.push(file);
        }
      }
    }
    if (itemList['getNextMarker']().length > 0) {
      await listFilesMarker(item, fileIds, subtitles, itemList['getNextMarker']());
    }
    for (var subItem of subItems) {
      await listFiles(subItem, fileIds, subtitles);
    }
  }
  
  function getParentFileId(vodId, shareInfo) {
    let fileInfos = shareInfo['file_infos'];
    if (!_['isEmpty'](vodId)) {
      return vodId;
    }
    if (fileInfos.length == 0) {
      return '';
    }
    let fileInfo = fileInfos[0];
    if (fileInfo['type'] == 'folder') {
      return fileInfo['file_id'];
    }
    if (fileInfo['type'] == 'file' && fileInfo['category'] == 'video') {
      return 'root';
    }
    return '';
  }
  
  function pair(keyword, itemList, result) {
    for (var item of itemList) {
      var itemName = c['removeExt'](item['getName']())['toLowerCase']();
      if (keyword.indexOf(itemName) > -1 || itemName.indexOf(keyword) > -1) {
        result.push(item);
      }
    }
  }
  
  function findSubs(filename, subtitles) {
    let result = [];
    pair(c['removeExt'](filename)['toLowerCase'](), subtitles, result);
    if (result.length == 0) {
      for (var subtitle of subtitles) {
        result.push(subtitle);
      }
    }
    let subsString = '';
    for (var subtitle of result) {
      subsString += '+' + c['removeExt'](subtitle['getName']()) + '@@@' + subtitle['getExt']() + '@@@' + subtitle['getFileId']();
    }
    return subsString;
  }
  
  async function getSubs(subtitles) {
    let subsUrls = [];
    for (var subtitle of subtitles) {
      if (!(subtitle['indexOf']('@@@') > -1)) {
        continue;
      }
      let parts = subtitle['split']('@@@');
      let name = parts[0];
      let ext = parts[1];
      let fileId = 'proxy://sub/' + parts[2];
      subsUrls.push(fileId);
    }
    return subsUrls;
  }
  
  async function getDownloadUrl(fileId) {
    tempIds.unshift(await copy(fileId));
    let params = {};
    params['file_id'] = tempIds[0];
    params['drive_id'] = user['getDriveId']();
    let response = await oauthFunc('openFile/getDownloadUrl', params, true);
    console.log('getDownloadUrl---');
    console.log(response);
    await log('getDownloadUrl---' + response);
    await deleteAll();
    return jsonParse(response)['url'];
  }
  
  async function getVideoPreviewPlayInfo(fileId) {
    tempIds.unshift(await copy(fileId));
    let params = {};
    params['file_id'] = tempIds[0];
    params['drive_id'] = user['getDriveId']();
    params['category'] = 'live_transcoding';
    params['url_expire_sec'] = '14400';
    let response = await oauthFunc('openFile/getVideoPreviewPlayInfo', params, true);
    console.log('getVideoPreviewPlayInfo===');
    console.log(response);
    await deleteAll();
    return jsonParse(response)['video_preview_play_info'];
  }
  
  async function playerContent(fileIds) {
    let downloadUrl = await getDownloadUrl(fileIds[0]);
    let subtitles = await getSubs(fileIds);
    return JSON.stringify({
      'parse': 0,
      'url': downloadUrl,
      'header': getHeader(),
      'subt': subtitles
    });
  }
  
  async function playerContentByFlag(fileIds, flag) {
    let playInfo = await getVideoPreviewPlayInfo(fileIds[0]);
    let previewUrl = getPreviewUrl(playInfo, flag);
    let subtitles = await getSubs(fileIds);
    let subsByPlayInfo = getSubsByPlayInfo(playInfo);
    for (var subtitle of subsByPlayInfo) {
      subtitles.push(subtitle);
    }
    return JSON.stringify({
      'parse': 0,
      'url': previewUrl,
      'header': getHeader(),
      'subt': subtitles
    });
  }
  
  function getPreviewUrl(playInfo, flag) {
    if (!playInfo.hasOwnProperty('live_transcoding_task_list')) {
      return '';
    }
    let tasks = playInfo['live_transcoding_task_list'];
    for (var i = 0; i < tasks.length; ++i) {
      let task = tasks[i];
      if (task['template_id'] == quality[flag]) {
        return task['url'];
      }
    }
    return tasks[0]['url'];
  }
  
  function getSubsByPlayInfo(playInfo) {
    if (!playInfo.hasOwnProperty('live_transcoding_subtitle_task_list')) {
      return [];
    }
    let subtitleTasks = playInfo['live_transcoding_subtitle_task_list'];
    let subtitles = [];
    for (var i = 0; i < subtitleTasks.length; ++i) {
      let task = subtitleTasks[i];
      let language = task['language'];
      let url = task['url'];
      subtitles.push(url);
    }
    return subtitles;
  }
  
  
  async function setToken(_refreshToken) {
    console.log("🚀 ~ setToken ~ _refreshToken:", _refreshToken)
    user.setRefreshToken(_refreshToken);
    refreshToken=_refreshToken
    // await refreshAccessToken();
  }
  
export { initSome, setToken, setShareId, getVod, playerContent, playerContentByFlag,getUserToken,getOAuthToken };