import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CreatePermission } from './application/createPermission';
import { GetAllPermissions } from './application/getAllPermissions';
import { GetUserByCredentials } from './application/getUserByCredentials';
import { SignUp } from './application/signUp';
import { PermissionRepository } from './domain/PermissionRepository';
import { UserAccountRepository } from './domain/UserAccountRepository';
import { AuthController } from './infrastructure/controllers/v1/auth.controller';
import { PermissionController } from './infrastructure/controllers/v1/permission.controller';
import { PgPermissionRepository } from './infrastructure/repositories/PgPermissionRepository';
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
  controllers: [AuthController, PermissionController],
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
  ],
  exports: [UserAccountRepository],
})
export class AuthModule {}
