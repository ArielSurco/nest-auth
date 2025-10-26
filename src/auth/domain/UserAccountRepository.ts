import { UserAccount, UserAccountPrimitive } from './UserAccount';

export abstract class UserAccountRepository {
  abstract create(userAccount: UserAccount): Promise<UserAccount>;
  abstract findByEmailOrUsername({
    email,
    username,
  }: Partial<
    Pick<UserAccountPrimitive, 'email' | 'username'>
  >): Promise<UserAccount | null>;
}
