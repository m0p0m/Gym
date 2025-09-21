// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Express {
  export interface Request {
    rawBody?: Buffer;
  }
}
