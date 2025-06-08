import Fastify from 'fastify';
import parcelRoutes from './modules/parcel/parcel.route';

const app = Fastify({
  logger: true,
});

app.register(parcelRoutes, { prefix: '/api' });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

export default app;
