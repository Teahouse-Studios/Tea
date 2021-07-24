import axios from 'axios'
import { User } from '.'
import { getAccountSkinAndCape } from '../api/mojang-api'
import { MojangAuthProfile, MojangAuthResponse } from '../types/auth'
import { RequestError } from '../types/index'
import { MojangApiSkinAndCape } from '../types/mojang-api'

/**
 * Authorize Minecraft account through Mojang Yggdrasil account system.
 * @author Dianliang233 <dianliang@teahou.se>
 */
export class MojangUser extends User {
  private authServer = 'https://authserver.mojang.com'

  constructor (
    username: string,
    password: string,
    clientToken?: string,
    agentName: 'Minecraft' | 'Scrolls' = 'Minecraft',
    agentVersion: number = 1
  ) {
    super()

    const payload = {
      agent: {
        name: agentName,
        version: agentVersion,
      },
      username: username,
      password: password,
      clientToken: clientToken,
      requestUser: true,
    }

    axios.post('/authenticate', payload, {
      baseURL: this.authServer,
    })
      .then((res) => {
        const d: MojangAuthResponse = res.data
        this.accessToken = d.accessToken
        this.clientToken = d.clientToken
        this.username = d.user.username
        this.id = d.user.id
        this.availableProfiles = d.availableProfiles
        this.selectedProfile = d.selectedProfile
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
    
    getAccountSkinAndCape(this.id).then(res => this.textures = res as MojangApiSkinAndCape)
  }

  public clientToken = ''
  public availableProfiles: MojangAuthProfile[] = []
  public selectedProfile: MojangAuthProfile = {
    name: '',
    id: ''
  }
}
