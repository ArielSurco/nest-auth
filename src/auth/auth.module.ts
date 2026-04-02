import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GetUserByCredentials } from './application/getUserByCredentials';
import { GetUserById } from './application/getUserById';
import { SignUp } from './application/signUp';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { SessionService } from './infrastructure/services/session.service';
import { UsersModule } from '../users/users.module';

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
    UsersModule,
  ],
  controllers: [],
  providers: [
    SignUp,
    GetUserByCredentials,
    GetUserById,
    SessionService,
    AuthGuard,
  ],
  exports: [
    AuthGuard,
    SessionService,
    UsersModule,
    SignUp,
    GetUserByCredentials,
    GetUserById,
  ],
})
export class AuthModule {}
