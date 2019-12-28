import { IJwtEncodeReturn } from '../../utils/token/interfaces/jwt.interface';

export interface ITokenData extends IJwtEncodeReturn {
  refreshToken: string;
}

export type IEncodableAccount = Partial<Account> &
  Required<Pick<Account, 'id'>>;
