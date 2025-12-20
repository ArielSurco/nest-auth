import { Injectable } from '@nestjs/common';
import { Permission, PermissionPrimitive } from '../../domain/Permission';
import { PermissionRepository } from '../../domain/PermissionRepository';

@Injectable()
export class MemoryPermissionRepository implements PermissionRepository {
  private permissions: PermissionPrimitive[] = [];

  async create(permission: Permission): Promise<Permission> {
    this.permissions.push(permission.toPrimitive());

    return Promise.resolve(permission);
  }

  async findByCode(
    code: PermissionPrimitive['code'],
  ): Promise<Permission | null> {
    const foundPermission = this.permissions.find(
      (permission) => permission.code === code,
    );

    return Promise.resolve(
      foundPermission ? Permission.create(foundPermission) : null,
    );
  }

  async findAll(): Promise<Permission[]> {
    return Promise.resolve(
      this.permissions.map((permission) => Permission.create(permission)),
    );
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    const foundPermissions = this.permissions.filter((permission) =>
      ids.includes(permission.id),
    );

    return Promise.resolve(
      foundPermissions.map((permission) => Permission.create(permission)),
    );
  }
}
