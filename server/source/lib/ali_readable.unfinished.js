import { _ } from './cat.js'
import { log } from './utils.js'
import {
  initSome,
  setToken,
  setShareId,
  getVod,
  playerContent,
  playerContentByFlag,
  getOAuthToken,
  getUserToken,
} from './ali_api_readable.js'

const ALIYUN_DRIVE_REGEX = /www.aliyundrive.com\/s\/([^\/]+)(\/folder\/([^\/]+))?/

async function initAli({token}) {
  await initSome(token)
}

async function detailContent(shareUrl) {
  const trimmedUrl = shareUrl.trim()
  const matchResult = trimmedUrl.match(ALIYUN_DRIVE_REGEX)
  if (_.isEmpty(matchResult)) return ''

  const shareId = matchResult[1]
  const folderId = matchResult.length == 3 ? matchResult[3] : ''

  await setShareId(shareId)
  console.log('🚀 ~ detailContent ~ setShareId: success')

  const vodResult = await getVod(trimmedUrl, folderId)
  const resultJson = JSON.stringify({ list: [vodResult] })

  return resultJson
}

async function playContent(quality, mediaId, sharedUrl) {
  const trimmedUrl = sharedUrl.trim()
  const matchResult = trimmedUrl.match(ALIYUN_DRIVE_REGEX)
  if (_.isEmpty(matchResult)) return ''

  const shareId = matchResult[1]
  await setShareId(shareId)

  const mediaIds = mediaId.split('+')
  const contentResult =
    quality == '原画' ? await playerContent(mediaIds) : await playerContentByFlag(mediaIds, quality)

  return contentResult
}

async function getToken(ali_token,shareId){
  console.log("🚀 ~ getToken ~ ali_token:", ali_token)
  // await setToken(ali_token)
  const oauthToken=await getOAuthToken(ali_token,shareId)
  const userToken=await getUserToken(ali_token,shareId)
  return {
    oauthToken,
    userToken
  }
}

export { initAli, detailContent, playContent,getToken }
