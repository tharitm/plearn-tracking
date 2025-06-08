import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ParcelController } from './parcel.controller';
import {
  definitions, // Import the definitions object
  ListParcelsQuerySchema,
  ListParcelsResponseSchema,
  GetParcelByIdParamsSchema,
  GetParcelByIdResponseSchema,
  UpdateParcelStatusParamsSchema,
  UpdateParcelStatusBodySchema,
  UpdateParcelStatusResponseSchema,
  ErrorSchema
} from './parcel.schema';

export default async function parcelRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  // Add shared schemas to Fastify instance
  for (const schema of Object.values(definitions)) {
    fastify.addSchema(schema);
  }

  const parcelController = new ParcelController(); // Instantiate controller

  fastify.route({
    method: 'GET',
    url: '/parcel',
    schema: {
      summary: 'List all parcels with pagination and filtering',
      tags: ['Parcel'],
      querystring: ListParcelsQuerySchema,
      response: {
        200: ListParcelsResponseSchema,
        500: ErrorSchema,
      },
    },
    handler: parcelController.listParcels.bind(parcelController),
  });

  fastify.route({
    method: 'GET',
    url: '/parcel/:id',
    schema: {
      summary: 'Get a single parcel by its ID',
      tags: ['Parcel'],
      params: GetParcelByIdParamsSchema,
      response: {
        200: GetParcelByIdResponseSchema, // This now refers to a schema that might use $ref to #ParcelCore
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: parcelController.getParcelById.bind(parcelController),
  });

  fastify.route({
    method: 'PATCH',
    url: '/admin/parcel/:id/status',
    schema: {
      summary: 'Update parcel status',
      description: 'Allows updating the status of a specific parcel. Optionally, a notification can be triggered.',
      tags: ['Parcel Admin'],
      params: UpdateParcelStatusParamsSchema,
      body: UpdateParcelStatusBodySchema,
      response: {
        200: UpdateParcelStatusResponseSchema, // This also might use $ref to #ParcelCore
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: parcelController.updateParcelStatus.bind(parcelController),
  });
}
