interface MojangAuthError {
  error: string;
  errorMessage: string;
  cause?: string;
}

interface MojangAuthResponse {
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

interface MojangAuthProfile {
  name: string,
  id: string  // It's actually a hex, but it's way too big
}

export { MojangAuthError, MojangAuthResponse, MojangAuthProfile }
