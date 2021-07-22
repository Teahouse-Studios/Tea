import axios from 'axios'
import { RequestError } from '../types'
import { MojangApiApiStatus, MojangApiProfile } from '../types/mojang-api'

/**
 * Interact with Mojang APIs, as documented in <https://wiki.vg/Mojang_API>
 * @link https://wiki.vg/Mojang_API
 * @author Dianliang233 <dianliang@teahou.se>
 */
export class MojangApi {
  /**
   * Store API domains
   * @private
   */
  private endpoint = {
    status: 'https://status.mojang.com',
    api: 'https://api.mojang.com',
    sessionserver: 'https://sessionserver.mojang.com',
    minecraftservices: 'https://api.minecraftservices.com',
    assets: 'http://assets.mojang.com',
  }

  public async getApiStatus(): Promise<Array<MojangApiApiStatus> | undefined> {
    let apiStatus: Array<MojangApiApiStatus> | undefined
    axios
      .get('/check', { baseURL: this.endpoint.status })
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

  public async getAccountInfoByUsername(
    username: string,
    timestamp: number = new Date().getUTCMilliseconds()
  ): Promise<MojangApiProfile | undefined> {
    let accountInfo: MojangApiProfile | undefined
    axios
      .get(`/users/profiles/minecraft/${username}`, {
        baseURL: this.endpoint.status,
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
          cause: err.response.cause || null
        }
        throw message
      })
    return accountInfo
  }
}
