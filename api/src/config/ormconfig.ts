import { DataSource, DataSourceOptions } from 'typeorm';
import { ENV } from './env';
import { Parcel } from '../modules/parcel/parcel.entity'; // Adjust path as necessary

// Ensure NODE_ENV is defined. Default to 'development' if not set.
const NODE_ENV = process.env.NODE_ENV || 'development';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres', // As per common setup, change if different DB
  url: ENV.DATABASE_URL,
  entities: [Parcel], // Add other entities here, e.g., join(__dirname, '/../modules/**/*.entity{.ts,.js}')
  // synchronize: NODE_ENV === 'development', // Auto-create schema (dev only). Careful with this in prod.
  synchronize: false, // Recommended to use migrations for schema changes
  logging: NODE_ENV === 'development' ? true : ['error'], // Log SQL queries in dev
  migrationsTableName: 'migrations',
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`], // Path to migration files
  // subscribers: [],
  // extra: {
  //   ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Example for Heroku/cloud DBs
  // },
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
