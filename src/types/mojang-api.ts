export interface MojangApiApiStatus {
  // ApiApiStatus is intended
  [index: string]: 'red' | 'yellow' | 'green'
}
export interface MojangApiProfile {
  id: string
  name: string,
  legacy?: boolean,
  demo?: boolean
}

export interface MojangApiNameHistory {
  name: string
  changedToAt?: number
}

export interface MojangApiSkinAndCapeRaw {
  timestamp: number
  profileId: string
  profileName: string
  textures: {
    SKIN: {
      url: string,
      metadata?: {
        model: 'slim'
      }
    }
    CAPE: {
      url: string
    }
  }
}

export interface MojangApiSkinAndCape {
  skin: {
    url: string,
    model: 'classic' | 'slim'
  },
  cape: {
    url: string
  }
}

export interface MojangApiStatsKeys {
  [index: number]:
    | 'item_sold_minecraft'
    | 'prepaid_card_redeemed_minecraft'
    | 'item_sold_cobalt'
    | 'item_sold_scrolls'
    | 'prepaid_card_redeemed_cobalt'
    | 'item_sold_dungeons'
}

export interface MojangApiStats {
  total: number,
  last24h: number,
  saleVelocityPerSeconds: number
}
