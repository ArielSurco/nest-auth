import { Injectable } from '@nestjs/common';
import { Role, RoleAttributes } from '../../domain/Role';
import { RoleRepository } from '../../domain/RoleRepository';

@Injectable()
export class MemoryRoleRepository implements RoleRepository {
  private roles: Role[] = [];

  async create(role: Role): Promise<Role> {
    this.roles.push(role);
    return Promise.resolve(role);
  }

  async findByCode(code: RoleAttributes['code']): Promise<Role | null> {
    const foundRole = this.roles.find((role) => role.code === code);
    const role = foundRole ? foundRole : null;
    return Promise.resolve(role);
  }

  async findAll(): Promise<Role[]> {
    const foundRoles = this.roles;
    return Promise.resolve(foundRoles);
  }
}
