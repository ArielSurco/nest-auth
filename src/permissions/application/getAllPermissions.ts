import { Injectable } from '@nestjs/common';
import { Permission } from '../domain/Permission';
import { PermissionRepository } from '../domain/PermissionRepository';

@Injectable()
export class GetAllPermissions {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findAll();

    return permissions;
  }
}
