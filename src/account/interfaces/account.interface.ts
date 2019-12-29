import { Account } from '../entities/account.entity';

export type GetMeResponse = Pick<
  Account,
  'id' | 'name' | 'profileImagePath' | 'createdAt' | 'statusMessage'
>;
