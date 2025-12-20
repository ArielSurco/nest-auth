import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CreatePermission } from './application/createPermission';
import { CreateRole } from './application/createRole';
import { GetAllPermissions } from './application/getAllPermissions';
import { GetAllRoles } from './application/getAllRoles';
import { GetUserByCredentials } from './application/getUserByCredentials';
import { SignUp } from './application/signUp';
import { PermissionRepository } from './domain/PermissionRepository';
import { RoleRepository } from './domain/RoleRepository';
import { UserAccountRepository } from './domain/UserAccountRepository';
import { AuthController } from './infrastructure/controllers/v1/auth.controller';
import { PermissionController } from './infrastructure/controllers/v1/permission.controller';
import { RoleController } from './infrastructure/controllers/v1/role.controller';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { PgPermissionRepository } from './infrastructure/repositories/PgPermissionRepository';
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
  controllers: [AuthController, PermissionController, RoleController],
  providers: [
    {
      provide: UserAccountRepository,
      useClass: PgUserAccountRepository,
    },
    SignUp,
    GetUserByCredentials,
    CreatePermission,
    GetAllPermissions,
    {
      provide: PermissionRepository,
      useClass: PgPermissionRepository,
    },
    {
      provide: RoleRepository,
      useClass: PgRoleRepository,
    },
    CreateRole,
    GetAllRoles,
    SessionService,
    AuthGuard,
  ],
  exports: [UserAccountRepository, RoleRepository, PermissionRepository],
})
export class AuthModule {}
