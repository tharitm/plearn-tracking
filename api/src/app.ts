import Fastify from 'fastify';
import { ENV } from './config/env';
import parcelRoutes from './modules/parcel/parcel.route';
// Import routes or plugins here, e.g.:
// import parcelRoutes from './modules/parcel/parcel.route';

const app = Fastify({
  logger: true, // Basic logging, adjust as needed
});

// Register plugins, routes, etc.
app.register(parcelRoutes, { prefix: '/api' }); // All parcel routes will be under /api/parcel
// app.register(parcelRoutes, { prefix: '/parcel' }); // Example

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

export default app;
