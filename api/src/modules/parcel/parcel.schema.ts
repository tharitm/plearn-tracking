import { Static, Type } from '@sinclair/typebox';

// --- Enums ---
export const ParcelStatusEnum = Type.Enum(
  { pending: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' },
  { $id: 'ParcelStatus' } // $id for referencing in other schemas
);
export type ParcelStatusType = Static<typeof ParcelStatusEnum>;

export const PaymentStatusEnum = Type.Enum(
  { unpaid: 'unpaid', paid: 'paid', partial: 'partial' },
  { $id: 'PaymentStatus' }
);
export type PaymentStatusType = Static<typeof PaymentStatusEnum>;


// --- Core Parcel Object ---
export const ParcelCoreSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  parcelRef: Type.String(),
  receiveDate: Type.String({ format: 'date-time' }), // Representing Date as ISO string
  customerCode: Type.String(),
  shipment: Type.String(),
  estimate: Type.Number(),
  status: ParcelStatusEnum,
  cnTracking: Type.String(),
  volume: Type.Number(),
  weight: Type.Number(),
  freight: Type.Number(),
  deliveryMethod: Type.String(),
  thTracking: Type.Optional(Type.String()),
  paymentStatus: PaymentStatusEnum,
  createdAt: Type.String({ format: 'date-time' }), // Representing Date as ISO string
  updatedAt: Type.String({ format: 'date-time' }), // Representing Date as ISO string
}, { $id: 'ParcelCore' });
export type ParcelCoreType = Static<typeof ParcelCoreSchema>;


// --- List Parcels (GET /parcel) ---
export const ListParcelsQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  status: Type.Optional(Type.Union([ParcelStatusEnum, Type.Literal('all')])), // Allow 'all'
  paymentStatus: Type.Optional(Type.Union([PaymentStatusEnum, Type.Literal('all')])), // Allow 'all'
  trackingNo: Type.Optional(Type.String()),
  dateFrom: Type.Optional(Type.String({ format: 'date' })), // YYYY-MM-DD
  dateTo: Type.Optional(Type.String({ format: 'date' })),   // YYYY-MM-DD
  customerCode: Type.Optional(Type.String()),
});
export type ListParcelsQueryType = Static<typeof ListParcelsQuerySchema>;

export const ListParcelsResponseSchema = Type.Object({
  parcels: Type.Array(ParcelCoreSchema),
  total: Type.Integer(),
  page: Type.Integer(),
  pageSize: Type.Integer(),
});
export type ListParcelsResponseType = Static<typeof ListParcelsResponseSchema>;


// --- Get Parcel by ID (GET /parcel/:id) ---
export const GetParcelByIdParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});
export type GetParcelByIdParamsType = Static<typeof GetParcelByIdParamsSchema>;

// Response is a single ParcelCore
export const GetParcelByIdResponseSchema = ParcelCoreSchema;
export type GetParcelByIdResponseType = Static<typeof GetParcelByIdResponseSchema>;


// --- Update Parcel Status (PATCH /admin/parcel/:id/status) ---
export const UpdateParcelStatusParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});
export type UpdateParcelStatusParamsType = Static<typeof UpdateParcelStatusParamsSchema>;

export const UpdateParcelStatusBodySchema = Type.Object({
  status: ParcelStatusEnum,
  notify: Type.Optional(Type.Boolean({ default: false })),
});
export type UpdateParcelStatusBodyType = Static<typeof UpdateParcelStatusBodySchema>;

// Response is the updated ParcelCore
export const UpdateParcelStatusResponseSchema = ParcelCoreSchema;
export type UpdateParcelStatusResponseType = Static<typeof UpdateParcelStatusResponseSchema>;


// --- Generic Error Response ---
export const ErrorSchema = Type.Object({
  statusCode: Type.Integer(),
  error: Type.String(),
  message: Type.String(),
});
export type ErrorSchemaType = Static<typeof ErrorSchema>;
