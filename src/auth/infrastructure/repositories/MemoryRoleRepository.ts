import { Injectable } from '@nestjs/common';
import { Role, RolePrimitive } from '../../domain/Role';
import { RoleRepository } from '../../domain/RoleRepository';

@Injectable()
export class MemoryRoleRepository implements RoleRepository {
  private roles: RolePrimitive[] = [];

  async create(role: Role): Promise<Role> {
    this.roles.push(role.toPrimitive());
    return Promise.resolve(role);
  }

  async findByCode(code: RolePrimitive['code']): Promise<Role | null> {
    const foundRole = this.roles.find((role) => role.code === code);
    const role = foundRole ? Role.create(foundRole) : null;
    return Promise.resolve(role);
  }

  async findAll(): Promise<Role[]> {
    const foundRoles = this.roles.map((role) => Role.create(role));
    return Promise.resolve(foundRoles);
  }
}
