import { Module } from '@nestjs/common';
import { SignUp } from './application/signUp';
import { UserAccountRepository } from './domain/UserAccountRepository';
import { AuthController } from './infrastructure/controllers/v1/auth.controller';
import { PgUserAccountRepository } from './infrastructure/repositories/PgUserAccountRepository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: UserAccountRepository,
      useClass: PgUserAccountRepository,
    },
    SignUp,
  ],
  exports: [UserAccountRepository],
})
export class AuthModule {}
