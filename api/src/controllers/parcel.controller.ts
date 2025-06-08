import { FastifyRequest, FastifyReply } from 'fastify';
// Assuming models/services are correctly structured for a class-based controller
// For example, you might inject a service or use static model methods.
// Let's assume `getAllParcels` and `getParcelById` are service methods or static model methods.
// This example will use them as if they are imported service functions for simplicity.
import { getAllParcels, getParcelById } from '../models/parcel.model'; // Adjust path as necessary

// Custom error for not found cases
export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ParcelController {
  constructor() {
    // If you have dependencies to inject, do it here.
    // e.g., this.parcelService = new ParcelService();
  }

  public async listParcels(request: FastifyRequest, reply: FastifyReply) {
    // In a class context, you might call a service method:
    // const parcels = await this.parcelService.getAll();
    // For now, using the imported function directly:
    const parcels = await getAllParcels();
    return parcels; // Return raw data
  }

  // Define a type for request parameters if you expect specific params like an ID
  // This can be defined outside or inside the class, or imported.
  // For consistency with the original file, defining it here.
  // private paramsInterface(id: string): { id: string } { return { id }; }
  // Commenting out the above as it's not used and FastifyRequest<{ Params: { id: string } }> is more direct.

  public async getParcelById(
    request: FastifyRequest<{ Params: { id: string } }>, // Simplified Params type
    reply: FastifyReply
  ) {
    const { id } = request.params;
    // const parcel = await this.parcelService.getById(id);
    const parcel = await getParcelById(id);
    if (parcel) {
      return parcel; // Return raw data
    } else {
      throw new NotFoundError('Parcel not found');
    }
  }

  public async updateParcelStatus(
    request: FastifyRequest<{ Params: { id: string }; Body: { status: string; notifyUser?: boolean } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const { status, notifyUser } = request.body;

    // Placeholder for actual update logic
    // const updatedParcel = await this.parcelService.updateStatus(id, status, notifyUser);
    // For now, let's assume a mock response or that a model/service handles this.
    // If the update is successful:
    // return updatedParcel;

    // Example:
    if (id === 'nonexistent') { // Simulate not found
        throw new NotFoundError(`Parcel with ID ${id} not found for status update.`);
    }
    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) { // Simulate bad request
        const err = new Error(`Invalid status: ${status}`);
        (err as any).statusCode = 400; // Attach statusCode for the error handler
        throw err;
    }

    // Mock successful update
    return { id, status, message: `Parcel ${id} status updated to ${status}.${notifyUser ? ' User notified.' : ''}` };
  }

  // Add other methods from the original parcel.route.ts schema if they were handled by this controller
  // e.g., createParcel, updateParcel, deleteParcel, etc.
  // For now, only listParcels, getParcelById, and updateParcelStatus (from route schema) are included.
}

// If there are other controllers, they should be refactored similarly.
// The existing `parcel.route.ts` instantiates `ParcelController`, so this class structure is appropriate.
