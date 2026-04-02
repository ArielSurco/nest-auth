import { Module } from '@nestjs/common';
import { UserAccountRepository } from './domain/UserAccountRepository';
import { PgUserAccountRepository } from './infrastructure/repositories/PgUserAccountRepository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: UserAccountRepository,
      useClass: PgUserAccountRepository,
    },
  ],
  exports: [UserAccountRepository],
})
export class UsersModule {}
