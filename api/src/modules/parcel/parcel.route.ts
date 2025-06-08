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
        200: GetParcelByIdResponseSchema,
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
        200: UpdateParcelStatusResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: parcelController.updateParcelStatus.bind(parcelController),
  });
}
