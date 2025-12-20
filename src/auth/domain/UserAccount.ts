import { v4 as uuidv4 } from 'uuid';
import { RolePrimitive } from './Role';

export interface UserAccountPrimitive {
  id: string;
  username: string;
  email: string;
  password: string;
  active: boolean;
  roles: RolePrimitive[];
}

export class UserAccount {
  constructor(private readonly primitive: UserAccountPrimitive) {}

  static create({
    id = uuidv4(),
    active = true,
    roles = [],
    ...primitive
  }: Omit<UserAccountPrimitive, 'id' | 'active' | 'roles'> &
    Partial<Pick<UserAccountPrimitive, 'id' | 'active' | 'roles'>>) {
    return new UserAccount({
      id,
      active,
      roles,
      ...primitive,
    });
  }

  toPrimitive(): UserAccountPrimitive {
    return {
      id: this.primitive.id,
      username: this.primitive.username,
      email: this.primitive.email,
      password: this.primitive.password,
      active: this.primitive.active,
      roles: this.primitive.roles,
    };
  }
}
