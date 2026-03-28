import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { Permission, PermissionPrimitive } from '../../auth/domain/Permission';
import { Role, RolePrimitive } from '../../auth/domain/Role';
import {
  UserAccount,
  UserAccountPrimitive,
} from '../../auth/domain/UserAccount';
import { PermissionEntity } from '../../auth/infrastructure/entities/PermissionEntity';
import { RoleEntity } from '../../auth/infrastructure/entities/RoleEntity';
import { UserAccountEntity } from '../../auth/infrastructure/entities/UserAccountEntity';

const permissionsPrimitives: Omit<
  PermissionPrimitive,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    code: 'global.permissions.create',
    name: 'Create Global Permission',
  },
  {
    code: 'global.permissions.read',
    name: 'Read Global Permission',
  },
  {
    code: 'global.roles.create',
    name: 'Create Global Role',
  },
  {
    code: 'global.roles.read',
    name: 'Read Global Role',
  },
  {
    code: 'global.roles.update',
    name: 'Update Global Role',
  },
  {
    code: 'global.roles.delete',
    name: 'Delete Global Role',
  },
  {
    code: 'global.accounts.deactivate',
    name: 'Deactivate User Account',
  },
  {
    code: 'global.accounts.read',
    name: 'Read User Accounts',
  },
  {
    code: 'global.accounts.update',
    name: 'Update User Accounts',
  },
];

// eslint-disable-next-line @typescript-eslint/unbound-method
const permissionsSeedData = permissionsPrimitives.map(Permission.create);

const rolePrimitives: Omit<RolePrimitive, 'id'>[] = [
  {
    code: 'creator',
    name: 'Creator',
    permissions: permissionsSeedData.map((permission) =>
      permission.toPrimitive(),
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/unbound-method
const rolesSeedData = rolePrimitives.map(Role.create);

const userAccountPrimitives: Omit<UserAccountPrimitive, 'id'>[] = [
  {
    username: process.env.CREATOR_USERNAME ?? '',
    email: process.env.CREATOR_EMAIL ?? '',
    password: bcrypt.hashSync(process.env.CREATOR_PASSWORD ?? '', 10),
    active: true,
    roles: rolesSeedData.map((role) => role.toPrimitive()),
  },
];

// eslint-disable-next-line @typescript-eslint/unbound-method
const userAccountSeedData = userAccountPrimitives.map(UserAccount.create);

export class Initialize1774671508849 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      permissionsSeedData.map((permission) =>
        queryRunner.manager.upsert(PermissionEntity, permission.toPrimitive(), [
          'code',
        ]),
      ),
    );

    await Promise.all(
      rolesSeedData.map((role) =>
        queryRunner.manager.save(RoleEntity, role.toPrimitive()),
      ),
    );

    await Promise.all(
      userAccountSeedData.map((userAccount) =>
        queryRunner.manager.save(UserAccountEntity, userAccount.toPrimitive()),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM user_role WHERE user_account_id IN (SELECT id FROM user_account WHERE username = ANY($1))`,
      [userAccountPrimitives.map((userAccount) => userAccount.username)],
    );

    await queryRunner.manager.delete(UserAccountEntity, {
      username: In(
        userAccountPrimitives.map((userAccount) => userAccount.username),
      ),
    });

    await queryRunner.query(
      `DELETE FROM role_permission WHERE role_id IN (SELECT id FROM role WHERE code = ANY($1))`,
      [rolePrimitives.map((role) => role.code)],
    );

    await queryRunner.manager.delete(RoleEntity, {
      code: In(rolePrimitives.map((role) => role.code)),
    });

    await queryRunner.manager.delete(PermissionEntity, {
      code: In(permissionsPrimitives.map((permission) => permission.code)),
    });
  }
}
