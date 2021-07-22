import axios from 'axios'
import { MojangAuthError, MojangAuthResponse } from '../types/auth'

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
  ): Promise<MojangAuthResponse | MojangAuthError | undefined> {
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
    let authError: MojangAuthError | undefined

    await axios.post('/authenticate', payload, {
      baseURL: this.authServer,
    })
      .then((res) => {
        authResponse = res.data
      })
      .catch((err) => {
        if (err.response) {
          authError = err.data
        } else if (err.request) {
          throw err.request
        } else {
          throw err.message
        }
      })

    return authResponse || authError
  }
}

export { MojangAuth }
