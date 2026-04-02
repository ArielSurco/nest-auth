import 'dotenv/config';
import {
  DataSource,
  DataSourceOptions as TypeOrmDataSourceOptions,
} from 'typeorm';

export const DataSourceOptions: TypeOrmDataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/infrastructure/entities/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
  logging: ['migration', 'error'],
};

export default new DataSource(DataSourceOptions);
