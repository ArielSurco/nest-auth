import { CustomPartial } from 'src/shared/types/CustomPartial';
import { v4 as uuidv4 } from 'uuid';
import { PermissionAttributes } from './Permission';
import { Role, RolePrimitive } from './Role';

export interface UserAccountAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  active: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAccountPrimitive
  extends Omit<UserAccountAttributes, 'roles' | 'createdAt' | 'updatedAt'> {
  roles: RolePrimitive[];
  createdAt: string;
  updatedAt: string;
}

export class UserAccount {
  constructor(private readonly attributes: UserAccountAttributes) {}

  static create({
    id = uuidv4(),
    active = true,
    roles = [],
    createdAt = new Date(),
    updatedAt = new Date(),
    ...attributes
  }: CustomPartial<
    UserAccountAttributes,
    'id' | 'active' | 'roles' | 'createdAt' | 'updatedAt'
  >) {
    return new UserAccount({
      id,
      active,
      roles,
      createdAt,
      updatedAt,
      ...attributes,
    });
  }

  toPrimitive(): UserAccountPrimitive {
    return {
      id: this.attributes.id,
      username: this.attributes.username,
      email: this.attributes.email,
      password: this.attributes.password,
      active: this.attributes.active,
      roles: this.attributes.roles.map((role) => role.toPrimitive()),
      createdAt: this.attributes.createdAt.toISOString(),
      updatedAt: this.attributes.updatedAt.toISOString(),
    };
  }

  can(permissionCode: PermissionAttributes['code']): boolean {
    return this.attributes.roles.some((role) => role.can(permissionCode));
  }

  get id(): string {
    return this.attributes.id;
  }

  get username(): string {
    return this.attributes.username;
  }

  get email(): string {
    return this.attributes.email;
  }

  get roles(): readonly Role[] {
    return this.attributes.roles;
  }
}
