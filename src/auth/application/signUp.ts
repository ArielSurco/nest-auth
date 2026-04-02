import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserAccount, UserAccountPrimitive } from '../domain/UserAccount';
import { UserAccountRepository } from '../domain/UserAccountRepository';

@Injectable()
export class SignUp {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async execute({
    username,
    email,
    password,
  }: Pick<
    UserAccountPrimitive,
    'username' | 'email' | 'password'
  >): Promise<UserAccount> {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const existingByEmail = await this.userAccountRepository.findByEmail(email);
    const existingByUsername = await this.userAccountRepository.findByUsername(username);
    if (existingByEmail || existingByUsername) throw new BadRequestException('User already exists');

    const userAccount = UserAccount.create({
      username,
      email,
      password: encryptedPassword,
    });

    return this.userAccountRepository.create(userAccount);
  }
}
