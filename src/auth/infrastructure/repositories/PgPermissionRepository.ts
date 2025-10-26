import { InjectDataSource } from '@nestjs/typeorm';
import { Permission, PermissionPrimitive } from 'src/auth/domain/Permission';
import { PermissionRepository } from 'src/auth/domain/PermissionRepository';
import { DataSource } from 'typeorm';
import { PermissionEntity } from '../entities/PermissionEntity';

export class PgPermissionRepository implements PermissionRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(permission: Permission): Promise<Permission> {
    const createdPermission = await this.dataSource
      .getRepository(PermissionEntity)
      .save(permission.toPrimitive());

    return Permission.create(createdPermission);
  }

  async findByCode(
    code: PermissionPrimitive['code'],
  ): Promise<Permission | null> {
    const foundPermission = await this.dataSource
      .getRepository(PermissionEntity)
      .findOne({ where: { code } });

    return foundPermission ? Permission.create(foundPermission) : null;
  }

  async findAll(): Promise<Permission[]> {
    const foundPermissions = await this.dataSource
      .getRepository(PermissionEntity)
      .find();

    return foundPermissions.map((permission) => Permission.create(permission));
  }
}
