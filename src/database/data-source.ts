import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'test',
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  entities: [join(__dirname, '../modules/**/entities/**/*.entity{.ts,.js}')],
  synchronize: false,
  logging: process.env.DB_ENABLE_QUERY_LOG === 'true',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
