export interface MojangApiApiStatus {
  [index: string]: 'red' | 'yellow' | 'green'
}

export interface MojangApiProfile {
  id: string,
  name: string
}
