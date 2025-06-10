import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import parcelRoutes from './parcel/parcel.route';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

export default async function registerAllRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  // Register authentication routes (e.g., /login)
  fastify.register(authRoutes);

  // Register admin routes (e.g., /admin/users, /admin/customers)
  fastify.register(adminRoutes, { prefix: '/admin' });

  // Register existing parcel routes (ensure this prefix is what you intend, or add one if needed)
  // Assuming parcelRoutes might have its own prefixing internally or expect to be at root or a specific prefix
  fastify.register(parcelRoutes, { prefix: '/parcels'}); // Added a common prefix for parcels as an example
}
