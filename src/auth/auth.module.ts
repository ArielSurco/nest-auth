import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GetUserByCredentials } from './application/getUserByCredentials';
import { GetUserById } from './application/getUserById';
import { SignUp } from './application/signUp';
import { UserAccountRepository } from './domain/UserAccountRepository';
import { AuthController } from './infrastructure/controllers/v1/auth.controller';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { PgUserAccountRepository } from './infrastructure/repositories/PgUserAccountRepository';
import { SessionService } from './infrastructure/services/session.service';

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
    GetUserById,
    SessionService,
    AuthGuard,
  ],
  exports: [UserAccountRepository, AuthGuard, SessionService],
})
export class AuthModule {}
