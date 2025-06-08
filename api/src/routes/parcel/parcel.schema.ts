export const ListParcelsQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    status: {
      type: 'string',
      enum: ['pending', 'shipped', 'delivered', 'cancelled', 'all'],
    },
    paymentStatus: {
      type: 'string',
      enum: ['unpaid', 'paid', 'partial', 'all'],
    },
    trackingNo: { type: 'string' },
    dateFrom: { type: 'string', format: 'date' },
    dateTo: { type: 'string', format: 'date' },
    customerCode: { type: 'string' },
  },
};

const ParcelCoreSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    parcelRef: { type: 'string' },
    receiveDate: { type: 'string', format: 'date-time' },
    customerCode: { type: 'string' },
    shipment: { type: 'string' },
    estimate: { type: 'number' },
    status: {
      type: 'string',
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    },
    cnTracking: { type: 'string' },
    volume: { type: 'number' },
    weight: { type: 'number' },
    freight: { type: 'number' },
    deliveryMethod: { type: 'string' },
    thTracking: { type: 'string' },
    paymentStatus: {
      type: 'string',
      enum: ['unpaid', 'paid', 'partial'],
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: [
    'id',
    'parcelRef',
    'receiveDate',
    'customerCode',
    'shipment',
    'estimate',
    'status',
    'cnTracking',
    'volume',
    'weight',
    'freight',
    'deliveryMethod',
    'paymentStatus',
    'createdAt',
    'updatedAt',
  ],
};

export const ListParcelsResponseSchema = {
  type: 'object',
  properties: {
    resultCode: { type: 'integer' },
    resultStatus: { type: 'string' },
    developerMessage: { type: 'string' },
    resultData: {
      type: 'object',
      properties: {
        parcels: {
          type: 'array',
          items: ParcelCoreSchema,
        },
        total: { type: 'integer' },
        page: { type: 'integer' },
        pageSize: { type: 'integer' },
      },
      required: ['parcels', 'total', 'page', 'pageSize'],
    },
  },
  required: ['resultCode', 'resultStatus', 'developerMessage', 'resultData'],
};

export const GetParcelByIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
  required: ['id'],
};

export const GetParcelByIdResponseSchema = {
  type: 'object',
  properties: {
    resultCode: { type: 'integer' },
    resultStatus: { type: 'string' },
    developerMessage: { type: 'string' },
    resultData: ParcelCoreSchema,
  },
  required: ['resultCode', 'resultStatus', 'developerMessage', 'resultData'],
};

export const UpdateParcelStatusParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
  required: ['id'],
};

export const UpdateParcelStatusBodySchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    },
    notify: { type: 'boolean', default: false },
  },
  required: ['status'],
};

export const UpdateParcelStatusResponseSchema = {
  type: 'object',
  properties: {
    resultCode: { type: 'integer' },
    resultStatus: { type: 'string' },
    developerMessage: { type: 'string' },
    resultData: ParcelCoreSchema,
  },
  required: ['resultCode', 'resultStatus', 'developerMessage', 'resultData'],
};

export const ErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['statusCode', 'error', 'message'],
};
