import { DataSource } from 'typeorm';
import { DataSourceOptions } from './migrations.data-source';

export default new DataSource({
  ...DataSourceOptions,
  migrations: [__dirname + '/seeds/*{.ts,.js}'],
});
