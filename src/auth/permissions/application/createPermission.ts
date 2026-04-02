import { BadRequestException, Injectable } from '@nestjs/common';
import { Permission, PermissionPrimitive } from '../domain/Permission';
import { PermissionRepository } from '../domain/PermissionRepository';

@Injectable()
export class CreatePermission {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute({
    code,
    name,
  }: Pick<PermissionPrimitive, 'code' | 'name'>): Promise<Permission> {
    const permissionExists = await this.permissionRepository.findByCode(code);

    if (permissionExists)
      throw new BadRequestException(
        `Permission with code ${code} already exists`,
      );

    const permission = Permission.create({ code, name });

    const createdPermission =
      await this.permissionRepository.create(permission);

    return createdPermission;
  }
}
