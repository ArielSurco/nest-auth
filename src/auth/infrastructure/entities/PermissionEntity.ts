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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
