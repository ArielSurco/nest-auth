import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserAccount } from '../../domain/UserAccount';
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

  async findByEmail(email: string): Promise<UserAccount | null> {
    const found = await this.dataSource
      .getRepository(UserAccountEntity)
      .findOne({ where: { email } });
    return found?.toDomain() ?? null;
  }

  async findByUsername(username: string): Promise<UserAccount | null> {
    const found = await this.dataSource
      .getRepository(UserAccountEntity)
      .findOne({ where: { username } });
    return found?.toDomain() ?? null;
  }
}
