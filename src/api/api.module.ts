import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { AuthController } from './v1/auth/auth.controller';
import { PermissionController } from './v1/permissions/permission.controller';
import { RoleController } from './v1/roles/role.controller';

@Module({
  imports: [AuthModule, PermissionsModule, RolesModule],
  controllers: [AuthController, PermissionController, RoleController],
})
export class ApiModule {}
