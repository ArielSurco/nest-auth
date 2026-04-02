import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { CreateRole } from './application/createRole';
import { GetAllRoles } from './application/getAllRoles';
import { RoleRepository } from './domain/RoleRepository';
import { PgRoleRepository } from './infrastructure/repositories/PgRoleRepository';

@Module({
  imports: [AuthModule, PermissionsModule],
  controllers: [],
  providers: [
    CreateRole,
    GetAllRoles,
    {
      provide: RoleRepository,
      useClass: PgRoleRepository,
    },
  ],
  exports: [RoleRepository, CreateRole, GetAllRoles],
})
export class RolesModule {}
