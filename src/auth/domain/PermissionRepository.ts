import { Permission, PermissionPrimitive } from './Permission';

export abstract class PermissionRepository {
  abstract create(permission: Permission): Promise<Permission>;
  abstract findByCode(
    code: PermissionPrimitive['code'],
  ): Promise<Permission | null>;
  abstract findAll(): Promise<Permission[]>;
}
