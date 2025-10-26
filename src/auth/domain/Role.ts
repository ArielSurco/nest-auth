import { v4 as uuidv4 } from 'uuid';
import { PermissionPrimitive } from './Permission';

export interface RolePrimitive {
  id: string;
  code: string;
  name: string;
  permissions: PermissionPrimitive[];
}

export class Role {
  constructor(private readonly primitive: RolePrimitive) {}

  static create({
    id = uuidv4(),
    permissions = [],
    ...primitive
  }: Omit<RolePrimitive, 'id' | 'permissions'> &
    Partial<Pick<RolePrimitive, 'id' | 'permissions'>>) {
    return new Role({
      id,
      permissions,
      ...primitive,
    });
  }

  toPrimitive(): RolePrimitive {
    return {
      id: this.primitive.id,
      code: this.primitive.code,
      name: this.primitive.name,
      permissions: this.primitive.permissions,
    };
  }

  hasPermission(permissionCode: PermissionPrimitive['code']): boolean {
    return this.primitive.permissions.some(
      (permission) => permissionCode === permission.code,
    );
  }
}
