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
  ErrorSchema
} from './parcel.schema';

export default async function parcelRoutes(fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  const parcelController = new ParcelController();

  fastify.route({
    method: 'GET',
    url: '/parcel',
    schema: {
      summary: 'รายการพัสดุ (พร้อมตัวกรองและการแบ่งหน้า)',
      tags: ['การจัดการพัสดุ'],
      querystring: ListParcelsQuerySchema,
      response: {
        200: ListParcelsResponseSchema,
      },
    },
    handler: parcelController.listParcels.bind(parcelController),
  });

  fastify.route({
    method: 'GET',
    url: '/parcel/:id',
    schema: {
      summary: 'ดูข้อมูลพัสดุตาม ID',
      tags: ['การจัดการพัสดุ'],
      params: GetParcelByIdParamsSchema,
      response: {
        200: GetParcelByIdResponseSchema,
      },
    },
    handler: parcelController.getParcelById.bind(parcelController),
  });

  fastify.route({
    method: 'PATCH',
    url: '/admin/parcel/:id/status',
    schema: {
      summary: 'อัปเดตสถานะพัสดุ',
      description: 'อนุญาตให้อัปเดตสถานะของพัสดุ สามารถเลือกส่งการแจ้งเตือนได้',
      tags: ['การจัดการพัสดุ (Admin)'],
      params: UpdateParcelStatusParamsSchema,
      body: UpdateParcelStatusBodySchema,
      response: {
        200: UpdateParcelStatusResponseSchema,
      },
    },
    handler: parcelController.updateParcelStatus.bind(parcelController),
  });
}
