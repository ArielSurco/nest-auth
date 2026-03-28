import { v4 as uuidv4 } from 'uuid';

export interface PermissionPrimitive {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Permission {
  constructor(private readonly primitive: PermissionPrimitive) {}

  static create({
    id = uuidv4(),
    createdAt = new Date(),
    updatedAt = new Date(),
    ...primitive
  }: Omit<PermissionPrimitive, 'id' | 'createdAt' | 'updatedAt'> &
    Partial<Pick<PermissionPrimitive, 'id' | 'createdAt' | 'updatedAt'>>) {
    return new Permission({
      id,
      createdAt,
      updatedAt,
      ...primitive,
    });
  }

  toPrimitive(): PermissionPrimitive {
    return {
      id: this.primitive.id,
      code: this.primitive.code,
      name: this.primitive.name,
      createdAt: this.primitive.createdAt,
      updatedAt: this.primitive.updatedAt,
    };
  }
}
