import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { GlobalPermissionCode } from '../../auth/permissions/domain/GlobalPermissionCode';
import { Permission, PermissionAttributes } from '../../auth/permissions/domain/Permission';
import { Role, RoleAttributes } from '../../auth/roles/domain/Role';
import {
  UserAccount,
  UserAccountAttributes,
} from '../../auth/users/domain/UserAccount';
import { PermissionEntity } from '../../auth/permissions/infrastructure/entities/PermissionEntity';
import { RoleEntity } from '../../auth/roles/infrastructure/entities/RoleEntity';
import { UserAccountEntity } from '../../auth/users/infrastructure/entities/UserAccountEntity';

const permissionsPrimitives: Omit<
  PermissionAttributes,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    code: GlobalPermissionCode.CREATE_PERMISSION,
    name: 'Create Global Permission',
  },
  {
    code: GlobalPermissionCode.READ_PERMISSION,
    name: 'Read Global Permission',
  },
  {
    code: GlobalPermissionCode.CREATE_ROLE,
    name: 'Create Global Role',
  },
  {
    code: GlobalPermissionCode.READ_ROLE,
    name: 'Read Global Role',
  },
  {
    code: GlobalPermissionCode.UPDATE_ROLE,
    name: 'Update Global Role',
  },
  {
    code: GlobalPermissionCode.DELETE_ROLE,
    name: 'Delete Global Role',
  },
  {
    code: GlobalPermissionCode.READ_ACCOUNT,
    name: 'Deactivate User Account',
  },
  {
    code: GlobalPermissionCode.UPDATE_ACCOUNT,
    name: 'Read User Accounts',
  },
  {
    code: GlobalPermissionCode.DELETE_ACCOUNT,
    name: 'Update User Accounts',
  },
];

// eslint-disable-next-line @typescript-eslint/unbound-method
const permissionsSeedData = permissionsPrimitives.map(Permission.create);

const rolePrimitives: Omit<RoleAttributes, 'id' | 'createdAt' | 'updatedAt'>[] =
  [
    {
      code: 'creator',
      name: 'Creator',
      permissions: permissionsSeedData,
    },
  ];

// eslint-disable-next-line @typescript-eslint/unbound-method
const rolesSeedData = rolePrimitives.map(Role.create);

const userAccountPrimitives: Omit<
  UserAccountAttributes,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    username: process.env.CREATOR_USERNAME ?? '',
    email: process.env.CREATOR_EMAIL ?? '',
    password: bcrypt.hashSync(process.env.CREATOR_PASSWORD ?? '', 10),
    active: true,
    roles: rolesSeedData,
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
