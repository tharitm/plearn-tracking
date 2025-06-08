import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import parcelRoutes from './parcel/parcel.route';
// Import other route modules here in the future
// e.g., import authRoutes from './auth/auth.route';

export default async function registerAllRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  // Register parcel routes
  fastify.register(parcelRoutes); // The prefix '/api' will be handled in app.ts

  // Register other routes here
  // fastify.register(authRoutes);

  // Potentially add a root health check or info route for this group if desired
  // fastify.get('/', async () => { return { status: 'ok', module: 'main-routes' } });
}
