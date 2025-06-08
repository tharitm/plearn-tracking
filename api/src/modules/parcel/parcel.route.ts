import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ParcelController } from './parcel.controller';
import {
  ListParcelsQuerySchema,
  ListParcelsResponseSchema,
  GetParcelByIdParamsSchema,
  GetParcelByIdResponseSchema,
  UpdateParcelStatusParamsSchema,
  UpdateParcelStatusBodySchema,
  UpdateParcelStatusResponseSchema,
  ErrorSchema // Ensure ErrorSchema is imported
} from './parcel.schema';

export default async function parcelRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  const parcelController = new ParcelController(); // Instantiate controller

  // GET /api/parcel - List parcels
  fastify.route({
    method: 'GET',
    url: '/parcel', // Base path is /api from app.ts registration
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

  // GET /api/parcel/:id - Get a single parcel
  fastify.route({
    method: 'GET',
    url: '/parcel/:id',
    schema: {
      summary: 'Get a single parcel by its ID',
      tags: ['Parcel'],
      params: GetParcelByIdParamsSchema,
      response: {
        200: GetParcelByIdResponseSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: parcelController.getParcelById.bind(parcelController),
  });

  // PATCH /api/admin/parcel/:id/status - Update parcel status
  // The registration in app.ts is for '/api', so full path is /api/admin/parcel/:id/status
  fastify.route({
    method: 'PATCH',
    url: '/admin/parcel/:id/status', // This path will be prefixed by /api
    schema: {
      summary: 'Update parcel status',
      description: 'Allows updating the status of a specific parcel. Optionally, a notification can be triggered.',
      tags: ['Parcel Admin'], // Separate tag for admin functionalities
      params: UpdateParcelStatusParamsSchema,
      body: UpdateParcelStatusBodySchema,
      response: {
        200: UpdateParcelStatusResponseSchema,
        400: ErrorSchema, // For validation errors on the request body
        404: ErrorSchema, // If the parcel with the given ID is not found
        500: ErrorSchema, // For internal server errors
      },
    },
    // It's good practice to bind the controller instance to its methods
    handler: parcelController.updateParcelStatus.bind(parcelController),
  });
}
