import { DataSource, DataSourceOptions } from 'typeorm';
import { ENV } from './env';

const NODE_ENV = process.env.NODE_ENV || 'development';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: ENV.DATABASE_URL,
  entities: [
    `${__dirname}/../entities/*.entity{.ts,.js}`,
  ],
  synchronize: NODE_ENV === 'development',
  logging: NODE_ENV === 'development' ? true : ['error'],
  migrationsTableName: 'migrations',
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  // subscribers: [],
  // extra: {
  //   ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Example for Heroku/cloud DBs
  // },
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
