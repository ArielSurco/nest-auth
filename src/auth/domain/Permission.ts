import { v4 as uuidv4 } from 'uuid';

export interface PermissionPrimitive {
  id: string;
  code: string;
  name: string;
}

export class Permission {
  constructor(private readonly primitive: PermissionPrimitive) {}

  static create({
    id = uuidv4(),
    ...primitive
  }: Omit<PermissionPrimitive, 'id'> &
    Partial<Pick<PermissionPrimitive, 'id'>>) {
    return new Permission({
      id,
      ...primitive,
    });
  }

  toPrimitive(): PermissionPrimitive {
    return {
      id: this.primitive.id,
      code: this.primitive.code,
      name: this.primitive.name,
    };
  }
}
