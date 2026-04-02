import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { CreatePermission } from './application/createPermission';
import { GetAllPermissions } from './application/getAllPermissions';
import { PermissionRepository } from './domain/PermissionRepository';
import { PermissionController } from './infrastructure/controllers/v1/permission.controller';
import { PgPermissionRepository } from './infrastructure/repositories/PgPermissionRepository';

@Module({
  imports: [AuthModule],
  controllers: [PermissionController],
  providers: [
    CreatePermission,
    GetAllPermissions,
    {
      provide: PermissionRepository,
      useClass: PgPermissionRepository,
    },
  ],
  exports: [PermissionRepository],
})
export class PermissionsModule {}
