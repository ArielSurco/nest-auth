import { MigrationInterface, QueryRunner, Table, TableOptions } from 'typeorm';

const auditColumns = {
  createdAt: {
    name: 'created_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  },
  updatedAt: {
    name: 'updated_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  },
  deletedAt: {
    name: 'deleted_at',
    type: 'timestamp',
    isNullable: true,
  },
} as const satisfies Record<
  string,
  NonNullable<TableOptions['columns']>[number]
>;

const idColumn: NonNullable<TableOptions['columns']>[number] = {
  name: 'id',
  type: 'uuid',
  isPrimary: true,
  default: 'uuid_generate_v4()',
};

const userAccountTable = new Table({
  name: 'user_account',
  columns: [
    idColumn,
    ...Object.values(auditColumns),
    {
      name: 'username',
      type: 'varchar',
      isUnique: true,
    },
    {
      name: 'email',
      type: 'varchar',
      isUnique: true,
    },
    {
      name: 'password',
      type: 'varchar',
    },
    {
      name: 'active',
      type: 'boolean',
      default: true,
    },
  ],
});

const userProfileTable = new Table({
  name: 'user_profile',
  columns: [
    idColumn,
    ...Object.values(auditColumns),
    {
      name: 'name',
      type: 'varchar',
      length: '64',
      isNullable: true,
    },
    {
      name: 'last_name',
      type: 'varchar',
      length: '64',
      isNullable: true,
    },
    {
      name: 'user_account_id',
      type: 'uuid',
    },
  ],
  foreignKeys: [
    {
      columnNames: ['user_account_id'],
      referencedTableName: 'user_account',
      referencedColumnNames: ['id'],
    },
  ],
});

const roleTable = new Table({
  name: 'role',
  columns: [
    idColumn,
    auditColumns.createdAt,
    auditColumns.updatedAt,
    {
      name: 'code',
      type: 'varchar',
      isUnique: true,
    },
    {
      name: 'name',
      type: 'varchar',
    },
  ],
});

const userRoleTable = new Table({
  name: 'user_role',
  columns: [
    {
      name: 'role_id',
      type: 'uuid',
    },
    {
      name: 'user_account_id',
      type: 'uuid',
    },
  ],
  foreignKeys: [
    {
      columnNames: ['user_account_id'],
      referencedTableName: userAccountTable.name,
      referencedColumnNames: [idColumn.name],
    },
    {
      columnNames: ['role_id'],
      referencedTableName: roleTable.name,
      referencedColumnNames: [idColumn.name],
    },
  ],
});

const permissionTable = new Table({
  name: 'permission',
  columns: [
    idColumn,
    auditColumns.createdAt,
    auditColumns.updatedAt,
    { name: 'code', type: 'varchar', isUnique: true },
    { name: 'name', type: 'varchar' },
  ],
});

const rolePermissionTable = new Table({
  name: 'role_permission',
  columns: [
    {
      name: 'role_id',
      type: 'uuid',
    },
    {
      name: 'permission_id',
      type: 'uuid',
    },
  ],
  foreignKeys: [
    {
      columnNames: ['role_id'],
      referencedTableName: roleTable.name,
      referencedColumnNames: [idColumn.name],
    },
    {
      columnNames: ['permission_id'],
      referencedTableName: permissionTable.name,
      referencedColumnNames: [idColumn.name],
    },
  ],
});

const permissionOverrideTable = new Table({
  name: 'permission_override',
  columns: [
    auditColumns.createdAt,
    auditColumns.updatedAt,
    {
      name: 'permission_id',
      type: 'uuid',
    },
    {
      name: 'user_account_id',
      type: 'uuid',
    },
    {
      name: 'override_effect',
      type: 'enum',
      enumName: 'permission_override_effect',
      enum: ['allow', 'deny'],
    },
  ],
  foreignKeys: [
    {
      columnNames: ['permission_id'],
      referencedTableName: permissionTable.name,
      referencedColumnNames: [idColumn.name],
    },
    {
      columnNames: ['user_account_id'],
      referencedTableName: userAccountTable.name,
      referencedColumnNames: [idColumn.name],
    },
  ],
});

export class Initialize1760760538622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(userAccountTable);
    await queryRunner.createTable(userProfileTable);
    await queryRunner.createTable(roleTable);
    await queryRunner.createTable(userRoleTable);
    await queryRunner.createTable(permissionTable);
    await queryRunner.createTable(rolePermissionTable);
    await queryRunner.createTable(permissionOverrideTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(permissionOverrideTable);
    await queryRunner.dropTable(rolePermissionTable);
    await queryRunner.dropTable(permissionTable);
    await queryRunner.dropTable(userRoleTable);
    await queryRunner.dropTable(roleTable);
    await queryRunner.dropTable(userProfileTable);
    await queryRunner.dropTable(userAccountTable);
  }
}
