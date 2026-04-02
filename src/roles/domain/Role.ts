import { CustomPartial } from 'src/shared/types/CustomPartial';
import { v4 as uuidv4 } from 'uuid';
import {
  Permission,
  PermissionAttributes,
  PermissionPrimitive,
} from '../../permissions/domain/Permission';

export interface RoleAttributes {
  id: string;
  code: string;
  name: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePrimitive
  extends Omit<RoleAttributes, 'permissions' | 'createdAt' | 'updatedAt'> {
  permissions: PermissionPrimitive[];
  createdAt: string;
  updatedAt: string;
}

export class Role {
  constructor(private readonly attributes: RoleAttributes) {}

  static create({
    id = uuidv4(),
    permissions = [],
    createdAt = new Date(),
    updatedAt = new Date(),
    ...attributes
  }: CustomPartial<
    RoleAttributes,
    'id' | 'permissions' | 'createdAt' | 'updatedAt'
  >) {
    return new Role({
      id,
      permissions,
      createdAt,
      updatedAt,
      ...attributes,
    });
  }

  toPrimitive(): RolePrimitive {
    return {
      id: this.attributes.id,
      code: this.attributes.code,
      name: this.attributes.name,
      permissions: this.attributes.permissions.map((permission) =>
        permission.toPrimitive(),
      ),
      createdAt: this.attributes.createdAt.toISOString(),
      updatedAt: this.attributes.updatedAt.toISOString(),
    };
  }

  can(permissionCode: PermissionAttributes['code']): boolean {
    return this.attributes.permissions.some((permission) =>
      permission.is(permissionCode),
    );
  }

  get id(): string {
    return this.attributes.id;
  }

  get code(): string {
    return this.attributes.code;
  }

  get name(): string {
    return this.attributes.name;
  }

  get permissions(): readonly Permission[] {
    return this.attributes.permissions;
  }
}
