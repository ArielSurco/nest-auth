import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CreateRole } from './application/createRole';
import { GetAllRoles } from './application/getAllRoles';
import { GetUserByCredentials } from './application/getUserByCredentials';
import { GetUserById } from './application/getUserById';
import { SignUp } from './application/signUp';
import { RoleRepository } from './domain/RoleRepository';
import { UserAccountRepository } from './domain/UserAccountRepository';
import { AuthController } from './infrastructure/controllers/v1/auth.controller';
import { RoleController } from './infrastructure/controllers/v1/role.controller';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { PgRoleRepository } from './infrastructure/repositories/PgRoleRepository';
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
  controllers: [AuthController, RoleController],
  providers: [
    {
      provide: UserAccountRepository,
      useClass: PgUserAccountRepository,
    },
    SignUp,
    GetUserByCredentials,
    GetUserById,
    {
      provide: RoleRepository,
      useClass: PgRoleRepository,
    },
    CreateRole,
    GetAllRoles,
    SessionService,
    AuthGuard,
  ],
  exports: [UserAccountRepository, RoleRepository, AuthGuard, SessionService],
})
export class AuthModule {}
