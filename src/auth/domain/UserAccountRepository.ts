import { UserAccount } from './UserAccount';

export abstract class UserAccountRepository {
  abstract create(userAccount: UserAccount): Promise<UserAccount>;
  abstract findById(id: string): Promise<UserAccount | null>;
  abstract findByEmail(email: string): Promise<UserAccount | null>;
  abstract findByUsername(username: string): Promise<UserAccount | null>;
}
