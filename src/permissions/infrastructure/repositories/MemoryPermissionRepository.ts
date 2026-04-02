import { Injectable } from '@nestjs/common';
import { Permission, PermissionAttributes } from '../../domain/Permission';
import { PermissionRepository } from '../../domain/PermissionRepository';

@Injectable()
export class MemoryPermissionRepository implements PermissionRepository {
  private permissions: Permission[] = [];

  async create(permission: Permission): Promise<Permission> {
    this.permissions.push(permission);

    return Promise.resolve(permission);
  }

  async findByCode(
    code: PermissionAttributes['code'],
  ): Promise<Permission | null> {
    const foundPermission = this.permissions.find((permission) =>
      permission.is(code),
    );

    return Promise.resolve(foundPermission ? foundPermission : null);
  }

  async findAll(): Promise<Permission[]> {
    return Promise.resolve(this.permissions);
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    const foundPermissions = this.permissions.filter((permission) =>
      ids.includes(permission.id),
    );

    return Promise.resolve(foundPermissions);
  }
}
