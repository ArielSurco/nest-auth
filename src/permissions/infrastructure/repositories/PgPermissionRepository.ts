import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  Permission,
  PermissionPrimitive,
} from 'src/permissions/domain/Permission';
import { PermissionRepository } from 'src/permissions/domain/PermissionRepository';
import { DataSource, In } from 'typeorm';
import { PermissionEntity } from '../entities/PermissionEntity';

@Injectable()
export class PgPermissionRepository implements PermissionRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(permission: Permission): Promise<Permission> {
    const createdPermission = await this.dataSource
      .getRepository(PermissionEntity)
      .save(PermissionEntity.fromDomain(permission));

    return createdPermission.toDomain();
  }

  async findByCode(
    code: PermissionPrimitive['code'],
  ): Promise<Permission | null> {
    const foundPermission = await this.dataSource
      .getRepository(PermissionEntity)
      .findOne({ where: { code } });

    return foundPermission?.toDomain() ?? null;
  }

  async findAll(): Promise<Permission[]> {
    const foundPermissions = await this.dataSource
      .getRepository(PermissionEntity)
      .find();

    return foundPermissions.map((permission) => permission.toDomain());
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    const foundPermissions = await this.dataSource
      .getRepository(PermissionEntity)
      .find({ where: { id: In(ids) } });

    return foundPermissions.map((permission) => permission.toDomain());
  }
}
