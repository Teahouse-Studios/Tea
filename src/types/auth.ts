export interface MojangAuthResponse {
  user: {
    username: string,
    properties: [
      {
        name: string,
        value: string,
      },
      {
        name: string,
        value: string,
      }
    ];
    id: string,
  },
  clientToken: string,
  accessToken: string,  // It's actually a hex, but it's way too big
  availableProfiles: Array<MojangAuthProfile>
  selectedProfile: MojangAuthProfile
}

export interface MojangAuthProfile {
  name: string,
  id: string  // It's actually a hex, but it's way too big
}

