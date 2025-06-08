import Fastify from 'fastify';
import registerAllRoutes from './routes/routes'; // Import the new central router

const app = Fastify({
  logger: true,
});

// Register all application routes under the /api prefix
app.register(registerAllRoutes, { prefix: '/api' });

app.get('/', async (request, reply) => {
  return { hello: 'world' }; // This root route is outside /api
});

export default app;
