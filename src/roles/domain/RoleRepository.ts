import { Role, RolePrimitive } from './Role';

export abstract class RoleRepository {
  abstract create(role: Role): Promise<Role>;
  abstract findByCode(code: RolePrimitive['code']): Promise<Role | null>;
  abstract findAll(): Promise<Role[]>;
}
