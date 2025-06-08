import { Type, Static } from '@sinclair/typebox';

// --- Enums (Keep existing Enums) ---
export const ParcelStatusEnum = Type.Enum(
  { pending: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' },
  { $id: 'ParcelStatus' }
);
export type ParcelStatusType = Static<typeof ParcelStatusEnum>;

export const PaymentStatusEnum = Type.Enum(
  { unpaid: 'unpaid', paid: 'paid', partial: 'partial' },
  { $id: 'PaymentStatus' }
);
export type PaymentStatusType = Static<typeof PaymentStatusEnum>;

// --- Core Parcel Data Schema (previously ParcelCoreSchema) ---
// This represents the data for a single parcel.
const ParcelDataSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  parcelRef: Type.String(),
  receiveDate: Type.String({ format: 'date-time' }),
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
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
}, { $id: 'ParcelData' }); // Changed $id for clarity if needed

// --- Data Schema for List Parcels Response ---
// This is what was previously the entire ListParcelsResponseSchema.
// It will now be the 'data' field in the BaseResponse for listing parcels.
const ListParcelsDataSchema = Type.Object({
  parcels: Type.Array(ParcelDataSchema), // Use ParcelDataSchema here
  total: Type.Integer(),
  page: Type.Integer(),
  pageSize: Type.Integer(),
}, { $id: 'ListParcelsData' });

// --- Data Schema for Update Parcel Status Response ---
// The response for updating a parcel status is the updated parcel itself.
const UpdateParcelStatusDataSchema = ParcelDataSchema; // It's just a single parcel


// --- Generic BaseResponse TypeBox Schema ---
// TData will be replaced by specific data schemas like ParcelDataSchema, ListParcelsDataSchema etc.
const BaseResponseSchema = <TDataObject extends Static<typeof Type.Any>>(TData: TDataObject | typeof Type.Null() = Type.Null()) => Type.Object({
  success: Type.Boolean(),
  statusCode: Type.Integer(),
  message: Type.String(),
  data: Type.Optional(TData === Type.Null() ? Type.Null() : TData),
  error: Type.Optional(Type.Object({
    code: Type.Optional(Type.String()),
    details: Type.Optional(Type.Any()), // Type.Any() or a more specific error detail schema
  })),
});


// --- Query and Params Schemas (Remain Unchanged) ---
export const ListParcelsQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  status: Type.Optional(Type.Union([ParcelStatusEnum, Type.Literal('all')])),
  paymentStatus: Type.Optional(Type.Union([PaymentStatusEnum, Type.Literal('all')])),
  trackingNo: Type.Optional(Type.String()),
  dateFrom: Type.Optional(Type.String({ format: 'date' })),
  dateTo: Type.Optional(Type.String({ format: 'date' })),
  customerCode: Type.Optional(Type.String()),
});
export type ListParcelsQueryType = Static<typeof ListParcelsQuerySchema>;

export const GetParcelByIdParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});
export type GetParcelByIdParamsType = Static<typeof GetParcelByIdParamsSchema>;

export const UpdateParcelStatusParamsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
});
export type UpdateParcelStatusParamsType = Static<typeof UpdateParcelStatusParamsSchema>;

export const UpdateParcelStatusBodySchema = Type.Object({
  status: ParcelStatusEnum,
  notify: Type.Optional(Type.Boolean({ default: false })),
});
export type UpdateParcelStatusBodyType = Static<typeof UpdateParcelStatusBodySchema>;


// --- Response Schemas (Wrapped with BaseResponseSchema) ---
export const ListParcelsResponseSchema = BaseResponseSchema(ListParcelsDataSchema);
export const GetParcelByIdResponseSchema = BaseResponseSchema(ParcelDataSchema);
export const UpdateParcelStatusResponseSchema = BaseResponseSchema(UpdateParcelStatusDataSchema);

// --- Standardized Error Response Schema ---
// This is a specific instance of BaseResponseSchema where success is false and data is usually null.
export const ErrorSchema = Type.Object({
  success: Type.Literal(false), // Error responses always have success: false
  statusCode: Type.Integer(),
  message: Type.String(),
  error: Type.Optional(Type.Object({
    code: Type.Optional(Type.String()),
    details: Type.Optional(Type.Any()), // Using Type.Any() for details, can be more specific
  })),
  data: Type.Optional(Type.Null()) // Explicitly data is optional and can be null for errors
});
export type ErrorSchemaType = Static<typeof ErrorSchema>;


// --- Static Types (Exporting existing and new ones for convenience) ---
export type ParcelDataType = Static<typeof ParcelDataSchema>;
export type ListParcelsDataType = Static<typeof ListParcelsDataSchema>;
// ListParcelsResponseType will now be the type of the wrapped response
export type ListParcelsResponseType = Static<typeof ListParcelsResponseSchema>;
export type GetParcelByIdResponseType = Static<typeof GetParcelByIdResponseSchema>;
export type UpdateParcelStatusResponseType = Static<typeof UpdateParcelStatusResponseSchema>;
