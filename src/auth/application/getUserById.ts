import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAccount } from '../domain/UserAccount';
import { UserAccountRepository } from '../domain/UserAccountRepository';

@Injectable()
export class GetUserById {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async execute(id: string): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findById(id);
    if (!userAccount) throw new UnauthorizedException();
    return userAccount;
  }
}
