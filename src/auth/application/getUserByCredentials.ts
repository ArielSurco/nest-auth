import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserAccount, UserAccountPrimitive } from '../../users/domain/UserAccount';
import { UserAccountRepository } from '../../users/domain/UserAccountRepository';

@Injectable()
export class GetUserByCredentials {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async execute({
    email,
    password,
  }: Pick<
    UserAccountPrimitive,
    'email' | 'password'
  >): Promise<UserAccount | null> {
    const userAccount = await this.userAccountRepository.findByEmail(email);

    if (!userAccount) return null;

    const isPasswordValid = await bcrypt.compare(
      password,
      userAccount.toPrimitive().password,
    );

    if (!isPasswordValid) return null;

    return userAccount;
  }
}
