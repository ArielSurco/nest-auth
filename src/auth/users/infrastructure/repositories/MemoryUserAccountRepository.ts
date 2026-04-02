import { Injectable } from '@nestjs/common';
import { UserAccount } from '../../domain/UserAccount';
import { UserAccountRepository } from '../../domain/UserAccountRepository';

@Injectable()
export class MemoryUserAccountRepository implements UserAccountRepository {
  private userAccounts: UserAccount[] = [];

  async create(userAccount: UserAccount): Promise<UserAccount> {
    this.userAccounts.push(userAccount);

    return Promise.resolve(userAccount);
  }

  async findById(id: string): Promise<UserAccount | null> {
    const foundUserAccount = this.userAccounts.find(
      (userAccount) => userAccount.id === id,
    );
    return Promise.resolve(foundUserAccount ? foundUserAccount : null);
  }

  async findByEmail(email: string): Promise<UserAccount | null> {
    const foundUserAccount = this.userAccounts.find(
      (userAccount) => userAccount.email === email,
    );
    return Promise.resolve(foundUserAccount ? foundUserAccount : null);
  }

  async findByUsername(username: string): Promise<UserAccount | null> {
    const foundUserAccount = this.userAccounts.find(
      (userAccount) => userAccount.username === username,
    );
    return Promise.resolve(foundUserAccount ? foundUserAccount : null);
  }
}
