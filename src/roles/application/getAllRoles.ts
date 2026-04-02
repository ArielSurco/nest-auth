import { Injectable } from '@nestjs/common';
import { Role } from '../domain/Role';
import { RoleRepository } from '../domain/RoleRepository';

@Injectable()
export class GetAllRoles {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();

    return roles;
  }
}
