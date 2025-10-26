import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GetUserByCredentials } from './application/getUserByCredentials';
import { SignUp } from './application/signUp';
import { UserAccountRepository } from './domain/UserAccountRepository';
import { AuthController } from './infrastructure/controllers/v1/auth.controller';
import { PgUserAccountRepository } from './infrastructure/repositories/PgUserAccountRepository';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: UserAccountRepository,
      useClass: PgUserAccountRepository,
    },
    SignUp,
    GetUserByCredentials,
  ],
  exports: [UserAccountRepository],
})
export class AuthModule {}
