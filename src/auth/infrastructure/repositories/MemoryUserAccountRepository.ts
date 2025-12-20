import { Injectable } from '@nestjs/common';
import { UserAccount, UserAccountPrimitive } from '../../domain/UserAccount';
import { UserAccountRepository } from '../../domain/UserAccountRepository';

@Injectable()
export class MemoryUserAccountRepository implements UserAccountRepository {
  private userAccounts: UserAccountPrimitive[] = [];

  async create(userAccount: UserAccount): Promise<UserAccount> {
    this.userAccounts.push(userAccount.toPrimitive());

    return Promise.resolve(userAccount);
  }

  async findById(id: string): Promise<UserAccount | null> {
    const foundUserAccount = this.userAccounts.find(
      (userAccount) => userAccount.id === id,
    );
    return Promise.resolve(
      foundUserAccount ? UserAccount.create(foundUserAccount) : null,
    );
  }

  async findByEmailOrUsername({
    email,
    username,
  }: Pick<
    UserAccountPrimitive,
    'email' | 'username'
  >): Promise<UserAccount | null> {
    const foundUserAccount = this.userAccounts.find(
      (userAccount) =>
        userAccount.email === email || userAccount.username === username,
    );

    const userAccount = foundUserAccount
      ? UserAccount.create(foundUserAccount)
      : null;

    return Promise.resolve(userAccount);
  }
}
