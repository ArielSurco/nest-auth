import { UserAccount, UserAccountPrimitive } from './UserAccount';

export abstract class UserAccountRepository {
  abstract create(userAccount: UserAccount): Promise<UserAccount>;
  abstract findByEmailOrUsername({
    email,
    username,
  }: Pick<
    UserAccountPrimitive,
    'email' | 'username'
  >): Promise<UserAccount | null>;
}
