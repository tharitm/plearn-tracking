import { FastifyRequest, FastifyReply } from 'fastify';
import { getAllParcels, getParcelById } from '../models/parcel.model';
// Make sure Parcel type is imported if you need to type request parameters or body.
// import { Parcel } from '../types/parcel.types';

export async function getAllParcelsHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parcels = await getAllParcels();
    reply.send(parcels);
  } catch (error) {
    request.log.error(error); // Log the error using Fastify's logger
    reply.status(500).send({ message: 'Error fetching parcels', error: (error as Error).message });
  }
}

// Define a type for request parameters if you expect specific params like an ID
interface GetParcelByIdParams {
  id: string;
}

export async function getParcelByIdHandler(
  request: FastifyRequest<{ Params: GetParcelByIdParams }>, // Specify Params type here
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const parcel = await getParcelById(id);
    if (parcel) {
      reply.send(parcel);
    } else {
      reply.status(404).send({ message: 'Parcel not found' });
    }
  } catch (error) {
    request.log.error(error);
    reply.status(500).send({ message: 'Error fetching parcel', error: (error as Error).message });
  }
}
