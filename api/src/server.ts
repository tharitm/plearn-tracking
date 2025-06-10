import 'reflect-metadata';
import app from './app';
import { ENV } from './config/env';
import AppDataSource from './config/ormconfig';

const start = async () => {
  try {
    // await AppDataSource.initialize();
    // app.log.info('Data Source has been initialized!');

    await app.listen({ port: Number(ENV.PORT), host: ENV.HOST });
  } catch (err) {
    app.log.error('Error during server startup or DB initialization:', err);
    process.exit(1);
  }
};

start();
