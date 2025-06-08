import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import parcelRoutes from './parcel/parcel.route';

export default async function registerAllRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  fastify.register(parcelRoutes);

}
