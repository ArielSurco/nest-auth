import { v4 as uuidv4 } from 'uuid';

export interface UserAccountPrimitive {
  id: string;
  username: string;
  email: string;
  password: string;
  active: boolean;
}

export class UserAccount {
  constructor(private readonly primitive: UserAccountPrimitive) {}

  static create({
    id = uuidv4(),
    active = true,
    ...primitive
  }: Omit<UserAccountPrimitive, 'id' | 'active'> &
    Partial<Pick<UserAccountPrimitive, 'id' | 'active'>>) {
    return new UserAccount({
      id,
      active,
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
    };
  }
}
