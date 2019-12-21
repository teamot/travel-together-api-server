export interface IJwtPayload {
  sub: string | number;
  exp: number;
}

export interface IJwtEncodeReturn {
  token: string;
  payload: IJwtPayload;
}
