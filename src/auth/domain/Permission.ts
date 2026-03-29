import { CustomPartial } from 'src/shared/types/CustomPartial';
import { v4 as uuidv4 } from 'uuid';

export interface PermissionAttributes {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionPrimitive
  extends Omit<PermissionAttributes, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export class Permission {
  constructor(private readonly attributes: PermissionAttributes) {}

  static create({
    id = uuidv4(),
    createdAt = new Date(),
    updatedAt = new Date(),
    ...attributes
  }: CustomPartial<PermissionAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    return new Permission({
      id,
      createdAt,
      updatedAt,
      ...attributes,
    });
  }

  toPrimitive(): PermissionPrimitive {
    return {
      id: this.attributes.id,
      code: this.attributes.code,
      name: this.attributes.name,
      createdAt: this.attributes.createdAt.toISOString(),
      updatedAt: this.attributes.updatedAt.toISOString(),
    };
  }

  is(permissionCode: PermissionAttributes['code']): boolean {
    return this.attributes.code === permissionCode;
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
}
