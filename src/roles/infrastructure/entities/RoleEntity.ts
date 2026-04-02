import { Role } from 'src/roles/domain/Role';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionEntity } from '../../../permissions/infrastructure/entities/PermissionEntity';

@Entity('role')
export class RoleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  code: string;

  @Column('varchar')
  name: string;

  @ManyToMany(() => PermissionEntity, { eager: true })
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    synchronize: false,
  })
  permissions: PermissionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  toDomain(): Role {
    return Role.create({
      id: this.id,
      code: this.code,
      name: this.name,
      permissions: this.permissions.map((permission) => permission.toDomain()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromDomain(role: Role): RoleEntity {
    const roleEntity = new RoleEntity();
    const rolePrimitive = role.toPrimitive();

    roleEntity.id = rolePrimitive.id;
    roleEntity.code = rolePrimitive.code;
    roleEntity.name = rolePrimitive.name;
    roleEntity.permissions = role.permissions.map((permission) =>
      PermissionEntity.fromDomain(permission),
    );
    roleEntity.createdAt = new Date(rolePrimitive.createdAt);
    roleEntity.updatedAt = new Date(rolePrimitive.updatedAt);
    return roleEntity;
  }
}
