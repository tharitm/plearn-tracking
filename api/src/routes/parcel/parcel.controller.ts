import { FastifyRequest, FastifyReply } from 'fastify';
import { ParcelService } from './parcel.service';
import {
  ListParcelsQuery,
  GetParcelByIdParams,
  UpdateParcelStatusParams,
  UpdateParcelStatusBody
} from './parcel.types';

export class ParcelController {
  private parcelService: ParcelService;

  constructor() {
    this.parcelService = new ParcelService();
  }

  async listParcels(
    request: FastifyRequest<{ Querystring: ListParcelsQuery }>, // Use new interface
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = request.query; // query is now typed as ListParcelsQuery
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
    request: FastifyRequest<{ Params: GetParcelByIdParams }>, // Use new interface
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params; // id is string due to GetParcelByIdParams
      const parcel = await this.parcelService.findOneById(id);

      if (!parcel) {
        reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Parcel not found' });
        return;
      }
      // ParcelService.toResponse will return the structure matching ParcelCoreSchema
      reply.send(ParcelService.toResponse(parcel));
    } catch (error) {
      request.log.error(error, 'Error getting parcel by ID');
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      reply.status(500).send({ statusCode: 500, error: 'Internal Server Error', message });
    }
  }

  async updateParcelStatus(
    request: FastifyRequest<{ Params: UpdateParcelStatusParams; Body: UpdateParcelStatusBody }>, // Use new interfaces
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params; // id is string
      const { status, notify } = request.body; // status and notify are typed

      const updatedParcel = await this.parcelService.updateStatus(id, status, notify);

      if (!updatedParcel) {
        reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Parcel not found or status not changed' });
        return;
      }
      // ParcelService.toResponse will return the structure matching ParcelCoreSchema
      reply.send(ParcelService.toResponse(updatedParcel));
    } catch (error) {
      request.log.error(error, 'Error updating parcel status');
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      reply.status(500).send({ statusCode: 500, error: 'Internal Server Error', message });
    }
  }
}
