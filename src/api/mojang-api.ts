/**
 * Interact with Mojang APIs, as documented in <https://wiki.vg/Mojang_API>
 * @link https://wiki.vg/Mojang_API
 * @author Dianliang233 <dianliang@teahou.se>
 */

import axios from 'axios'
import { RequestError } from '../types'
import {
  MojangApiApiStatus,
  MojangApiNameHistory,
  MojangApiProfile,
  MojangApiSkinAndCape,
  MojangApiSkinAndCapeRaw,
  MojangApiStats,
  MojangApiStatsKeys,
} from '../types/mojang-api'

const endpoint = {
  status: 'https://status.mojang.com',
  api: 'https://api.mojang.com',
  sessionserver: 'https://sessionserver.mojang.com',
  minecraftservices: 'https://api.minecraftservices.com',
  assets: 'http://assets.mojang.com',
}

export async function getApiStatus(): Promise<
  Array<MojangApiApiStatus> | undefined
  > {
  let apiStatus: Array<MojangApiApiStatus> | undefined
  await axios
    .get('/check', { baseURL: endpoint.status })
    .then((res) => {
      apiStatus = res.data
    })
    .catch((err) => {
      const message: RequestError = {
        name: err.request || null,
        code: err.code || null,
        message: 'Not applicable',
      }
      throw message
    })

  return apiStatus
}

export async function getAccountInfoByUsername(
  username: string,
  timestamp: number = new Date().getUTCMilliseconds()
): Promise<MojangApiProfile | undefined> {
  let accountInfo: MojangApiProfile | undefined
  await axios
    .get(`/users/profiles/minecraft/${username}`, {
      baseURL: endpoint.api,
      params: {
        at: timestamp,
      },
    })
    .then((res) => {
      if (res.status === 204) {
        const message: RequestError = {
          name: 'Not Found',
          code: 204,
          message: 'This user cannot be found.',
        }
        throw message
      }
      accountInfo = res.data
    })
    .catch((err) => {
      const message: RequestError = {
        code: err.code || null,
        name: err.response.error || err.request || null,
        message: err.response.errorMessage || null,
        cause: err.response.cause || null,
      }
      throw message
    })
  return accountInfo
}

export async function getAccountInfoByUsernames(
  usernames: Array<string>
): Promise<Array<MojangApiProfile> | undefined> {
  let accountInfo: Array<MojangApiProfile> | undefined
  await axios
    .post('/profiles/minecraft', usernames, { baseURL: endpoint.api })
    .then((res) => {
      accountInfo = res.data
    })
    .catch((err) => {
      const message: RequestError = {
        code: err.code || null,
        name: err.response.error || err.request || null,
        message: err.response.errorMessage || null,
        cause: err.response.cause || null,
      }
      throw message
    })
  return accountInfo
}

export async function getAccountNameHistory(
  id: string
): Promise<Array<MojangApiNameHistory> | undefined> {
  let nameHistory: Array<MojangApiNameHistory> | undefined
  await axios
    .get(`/user/profiles/${id}/names`, {
      baseURL: endpoint.api,
    })
    .then((res) => {
      nameHistory = res.data
    })
    .catch((err) => {
      const message: RequestError = {
        code: err.code || null,
        name: err.response.error || err.request || null,
        message: err.response.errorMessage || null,
        cause: err.response.cause || null,
      }
      throw message
    })
  return nameHistory
}

export async function getAccountSkinAndCape(
  id: string
): Promise<MojangApiSkinAndCape | undefined> {
  let result: MojangApiSkinAndCape | undefined
  await axios
    .get(`/session/minecraft/profile/${id}`, {
      baseURL: endpoint.sessionserver,
    })
    .then((res) => {
      const raw: string = res.data.properties.value
      const decoded: string = Buffer.from(raw, 'base64').toString('ascii')
      const obj: MojangApiSkinAndCapeRaw = JSON.parse(decoded)
      result = {
        skin: {
          url: obj.textures.SKIN.url,
          model: obj.textures.SKIN.metadata ? 'slim' : 'classic',
        },
        cape: {
          url: obj.textures.CAPE.url,
        },
      }
    })
    .catch((err) => {
      const message: RequestError = {
        code: err.code || null,
        name: err.response.error || err.request || null,
        message: err.response.errorMessage || null,
        cause: err.response.cause || null,
      }
      throw message
    })
  return result
}

export async function getBlockedServerList(): Promise<
  Array<string> | undefined
  > {
  let blockedServer: Array<string> | undefined
  await axios
    .get('/blockedservers', { baseURL: endpoint.sessionserver })
    .then((res) => {
      blockedServer = res.data.prototype.split('\n')
    })
    .catch((err) => {
      const message: RequestError = {
        code: err.code || null,
        name: err.response.error || err.request || null,
        message: err.response.errorMessage || null,
        cause: err.response.cause || null,
      }
      throw message
    })
  return blockedServer
}

export async function getSaleStats(
  keys: Array<MojangApiStatsKeys>
): Promise<MojangApiStats | undefined> {
  let stats: MojangApiStats | undefined
  axios
    .post('/orders/statistics', keys, { baseURL: endpoint.api })
    .then((res) => (stats = res.data))
    .catch((err) => {
      const message: RequestError = {
        code: err.code || null,
        name: err.response.error || err.request || null,
        message: err.response.errorMessage || null,
        cause: err.response.cause || null,
      }
      throw message
    })
  return stats
}
