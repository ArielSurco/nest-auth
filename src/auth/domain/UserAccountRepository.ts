import { UserAccount, UserAccountPrimitive } from './UserAccount';

export abstract class UserAccountRepository {
  abstract create(userAccount: UserAccount): Promise<UserAccount>;
  abstract findById(id: string): Promise<UserAccount | null>;
  abstract findByEmailOrUsername({
    email,
    username,
  }: Partial<
    Pick<UserAccountPrimitive, 'email' | 'username'>
  >): Promise<UserAccount | null>;
}
