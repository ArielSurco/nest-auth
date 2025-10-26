import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionRepository } from '../domain/PermissionRepository';
import { Role, RolePrimitive } from '../domain/Role';
import { RoleRepository } from '../domain/RoleRepository';

@Injectable()
export class CreateRole {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async execute({
    code,
    name,
    permissionIds = [],
  }: Pick<RolePrimitive, 'code' | 'name'> & {
    permissionIds: string[];
  }): Promise<Role> {
    const roleExists = await this.roleRepository.findByCode(code);

    if (roleExists) {
      throw new BadRequestException(`Role with code ${code} already exists`);
    }

    const permissions =
      await this.permissionRepository.findByIds(permissionIds);

    const role = Role.create({
      code,
      name,
      permissions: permissions.map((permission) => permission.toPrimitive()),
    });

    const createdRole = await this.roleRepository.create(role);

    return createdRole;
  }
}
