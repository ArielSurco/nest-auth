import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreatePermission } from './application/createPermission';
import { GetAllPermissions } from './application/getAllPermissions';
import { PermissionRepository } from './domain/PermissionRepository';
import { PgPermissionRepository } from './infrastructure/repositories/PgPermissionRepository';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    CreatePermission,
    GetAllPermissions,
    {
      provide: PermissionRepository,
      useClass: PgPermissionRepository,
    },
  ],
  exports: [PermissionRepository, CreatePermission, GetAllPermissions],
})
export class PermissionsModule {}
