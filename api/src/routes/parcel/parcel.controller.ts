import { FastifyRequest, FastifyReply } from 'fastify';
import { ParcelService } from './parcel.service';
import {
  ListParcelsQuery,
  GetParcelByIdParams,
  UpdateParcelStatusParams,
  UpdateParcelStatusBody
} from './parcel.types';
import { sendSuccess, sendError } from '../../handlers/response.handler'; // Import new handlers
import { RESPONSE_TYPE } from '../../common/responses';

export class ParcelController {
  private parcelService: ParcelService;

  constructor() {
    this.parcelService = new ParcelService();
  }

  async listParcels(
    request: FastifyRequest<{ Querystring: ListParcelsQuery }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const query = request.query;
      const { parcels, total } = await this.parcelService.findMany(query);
      const responseData = ParcelService.toListResponse(parcels, total, query.page || 1, query.pageSize || 10);
      sendSuccess(reply, responseData, RESPONSE_TYPE.SUCCESS);
    } catch (error) {
      sendError(reply, RESPONSE_TYPE.INTERNAL_ERROR, error as Error, 'Failed to list parcels.');
    }
  }

  async getParcelById(
    request: FastifyRequest<{ Params: GetParcelByIdParams }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const parcel = await this.parcelService.findOneById(id);

      if (!parcel) {
        sendError(reply, RESPONSE_TYPE.NOT_FOUND, undefined, 'Parcel not found.');
        return;
      }
      sendSuccess(reply, ParcelService.toResponse(parcel), RESPONSE_TYPE.SUCCESS);
    } catch (error) {
      // request.log.error(error, 'Error getting parcel by ID');
      sendError(reply, RESPONSE_TYPE.INTERNAL_ERROR, error as Error, 'Failed to retrieve parcel.');
    }
  }

  async updateParcelStatus(
    request: FastifyRequest<{ Params: UpdateParcelStatusParams; Body: UpdateParcelStatusBody }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params;
      const { status, notify } = request.body;

      // Basic input validation example (though schema validation should catch this)
      // if (!status) {
      //   sendError(reply, 'validationFail', undefined, 'Status is required in the body.');
      //   return;
      // }

      const updatedParcel = await this.parcelService.updateStatus(id, status, notify);

      if (!updatedParcel) {
        // This could be 'notFound' or a specific business logic error like 'conflict' if status cannot be updated
        sendError(reply, RESPONSE_TYPE.NOT_FOUND, undefined, 'Parcel not found or status not changed.');
        return;
      }
      sendSuccess(reply, ParcelService.toResponse(updatedParcel), RESPONSE_TYPE.SUCCESS);
    } catch (error) {
      // request.log.error(error, 'Error updating parcel status');
      // Consider if some errors from service layer should map to different error keys
      // e.g. if service throws a specific "VersionConflictError" -> sendError(reply, 'conflict', error)
      sendError(reply, RESPONSE_TYPE.INTERNAL_ERROR, error as Error, 'Failed to update parcel status.');
    }
  }
}
