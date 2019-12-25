import { Account } from '../entities/account.entity';

// export type GetMeResponse = Partial<Account>;
export type GetMeResponse = Pick<
  Account,
  'id' | 'name' | 'profileImageUrl' | 'createdAt' | 'statusMessage'
>;
