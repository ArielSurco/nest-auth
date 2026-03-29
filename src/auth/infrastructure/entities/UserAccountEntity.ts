import { UserAccount } from 'src/auth/domain/UserAccount';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './RoleEntity';

@Entity('user_account')
export class UserAccountEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  username: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @ManyToMany(() => RoleEntity, { eager: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_account_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    synchronize: false,
  })
  roles: RoleEntity[];

  @Column('boolean', { default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  toDomain(): UserAccount {
    return UserAccount.create({
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      active: this.active,
      roles: this.roles.map((role) => role.toDomain()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromDomain(userAccount: UserAccount): UserAccountEntity {
    const userAccountEntity = new UserAccountEntity();
    const userAccountPrimitive = userAccount.toPrimitive();

    userAccountEntity.id = userAccountPrimitive.id;
    userAccountEntity.username = userAccountPrimitive.username;
    userAccountEntity.email = userAccountPrimitive.email;
    userAccountEntity.password = userAccountPrimitive.password;
    userAccountEntity.active = userAccountPrimitive.active;
    userAccountEntity.roles = userAccount.roles.map((role) =>
      RoleEntity.fromDomain(role),
    );
    userAccountEntity.createdAt = new Date(userAccountPrimitive.createdAt);
    userAccountEntity.updatedAt = new Date(userAccountPrimitive.updatedAt);

    return userAccountEntity;
  }
}
