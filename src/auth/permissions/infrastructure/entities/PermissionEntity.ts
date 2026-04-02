import { Permission } from 'src/auth/permissions/domain/Permission';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permission')
export class PermissionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  code: string;

  @Column('varchar')
  name: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  toDomain(): Permission {
    return Permission.create({
      id: this.id,
      code: this.code,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromDomain(permission: Permission): PermissionEntity {
    const permissionEntity = new PermissionEntity();
    const permissionPrimitive = permission.toPrimitive();

    permissionEntity.id = permissionPrimitive.id;
    permissionEntity.code = permissionPrimitive.code;
    permissionEntity.name = permissionPrimitive.name;
    permissionEntity.createdAt = new Date(permissionPrimitive.createdAt);
    permissionEntity.updatedAt = new Date(permissionPrimitive.updatedAt);

    return permissionEntity;
  }
}
