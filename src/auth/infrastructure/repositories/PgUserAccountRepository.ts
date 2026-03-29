import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserAccount, UserAccountAttributes } from '../../domain/UserAccount';
import { UserAccountRepository } from '../../domain/UserAccountRepository';
import { UserAccountEntity } from '../entities/UserAccountEntity';

@Injectable()
export class PgUserAccountRepository implements UserAccountRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(userAccount: UserAccount): Promise<UserAccount> {
    const createdUserAccount = await this.dataSource
      .getRepository(UserAccountEntity)
      .save(UserAccountEntity.fromDomain(userAccount));

    return createdUserAccount.toDomain();
  }

  async findById(id: string): Promise<UserAccount | null> {
    const foundUserAccount = await this.dataSource
      .getRepository(UserAccountEntity)
      .findOne({ where: { id } });

    return foundUserAccount?.toDomain() ?? null;
  }

  async findByEmailOrUsername({
    email,
    username,
  }: Pick<
    UserAccountAttributes,
    'email' | 'username'
  >): Promise<UserAccount | null> {
    const foundUserAccount = await this.dataSource
      .getRepository(UserAccountEntity)
      .findOne({
        where: {
          email,
          username,
        },
      });

    return foundUserAccount?.toDomain() ?? null;
  }
}
