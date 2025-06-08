import { FastifyRequest, FastifyReply } from 'fastify';
import { ParcelService } from './parcel.service';
import {
  ListParcelsQueryType,
  GetParcelByIdParamsType,
  ParcelCoreType,
  ListParcelsResponseType,
  UpdateParcelStatusParamsType,
  UpdateParcelStatusBodyType,
  // ParcelStatusType is implicitly part of UpdateParcelStatusBodyType
} from './parcel.schema';

export class ParcelController {
  private parcelService: ParcelService;

  constructor() {
    this.parcelService = new ParcelService();
  }

  async listParcels(
    request: FastifyRequest<{ Querystring: ListParcelsQueryType }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = request.query;
      const { parcels, total } = await this.parcelService.findMany(query);

      const response = ParcelService.toListResponse(parcels, total, query.page || 1, query.pageSize || 10);
      reply.send(response);
    } catch (error) {
      request.log.error(error, 'Error listing parcels');
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      reply.status(500).send({ statusCode: 500, error: 'Internal Server Error', message });
    }
  }

  async getParcelById(
    request: FastifyRequest<{ Params: GetParcelByIdParamsType }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const parcel = await this.parcelService.findOneById(id);

      if (!parcel) {
        reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Parcel not found' });
        return;
      }
      reply.send(ParcelService.toResponse(parcel));
    } catch (error) {
      request.log.error(error, 'Error getting parcel by ID');
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      reply.status(500).send({ statusCode: 500, error: 'Internal Server Error', message });
    }
  }

  async updateParcelStatus(
    request: FastifyRequest<{ Params: UpdateParcelStatusParamsType; Body: UpdateParcelStatusBodyType }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const { status, notify } = request.body;

      // Schema validation should handle if status is missing, but an explicit check can be a safeguard
      // However, relying on Fastify's schema validation is generally preferred.
      // if (!status) {
      //     reply.status(400).send({ statusCode: 400, error: 'Bad Request', message: 'Status is required in the body.' });
      //     return;
      // }

      const updatedParcel = await this.parcelService.updateStatus(id, status, notify);

      if (!updatedParcel) {
        reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Parcel not found or status not changed' });
        return;
      }
      reply.send(ParcelService.toResponse(updatedParcel));
    } catch (error) {
      request.log.error(error, 'Error updating parcel status');
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      reply.status(500).send({ statusCode: 500, error: 'Internal Server Error', message });
    }
  }
}
