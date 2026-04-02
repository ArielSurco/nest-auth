import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Role, RolePrimitive } from 'src/auth/roles/domain/Role';
import { RoleRepository } from 'src/auth/roles/domain/RoleRepository';
import { DataSource } from 'typeorm';
import { RoleEntity } from '../entities/RoleEntity';

@Injectable()
export class PgRoleRepository implements RoleRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(role: Role): Promise<Role> {
    const createdRole = await this.dataSource
      .getRepository(RoleEntity)
      .save(RoleEntity.fromDomain(role));

    return createdRole.toDomain();
  }

  async findByCode(code: RolePrimitive['code']): Promise<Role | null> {
    const foundRole = await this.dataSource
      .getRepository(RoleEntity)
      .findOne({ where: { code } });

    return foundRole?.toDomain() ?? null;
  }

  async findAll(): Promise<Role[]> {
    const foundRoles = await this.dataSource.getRepository(RoleEntity).find();

    return foundRoles.map((role) => role.toDomain());
  }
}
