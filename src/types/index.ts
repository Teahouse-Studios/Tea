export interface RequestError extends Error {
  code?: number,
  developerMessage?: string
  cause?: string;
}
