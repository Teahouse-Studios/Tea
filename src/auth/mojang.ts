import axios from 'axios'
import { MojangAuthResponse } from '../types/auth'
import { RequestError } from '../types/index'

/**
 * Authorize Minecraft account through Mojang Yggdrasil account system.
 * @author Dianliang233 <dianliang@teahou.se>
 */
class MojangAuth {
  private authServer = 'https://authserver.mojang.com'

  public async authenticate(
    username: string,
    password: string,
    token?: string,
    agentName: 'Minecraft' | 'Scrolls' = 'Minecraft',
    agentVersion: number = 1
  ): Promise<MojangAuthResponse | undefined> {
    const payload = {
      agent: {
        name: agentName,
        version: agentVersion,
      },
      username: username,
      password: password,
      clientToken: token,
      requestUser: true,
    }

    let authResponse: MojangAuthResponse | undefined

    await axios.post('/authenticate', payload, {
      baseURL: this.authServer,
    })
      .then((res) => {
        authResponse = res.data
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

    return authResponse
  }
}

export { MojangAuth }
