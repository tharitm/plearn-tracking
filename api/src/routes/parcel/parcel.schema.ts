export const definitions = {
  ParcelStatus: {
    $id: '#ParcelStatus',
    type: 'string',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
  },
  PaymentStatus: {
    $id: '#PaymentStatus',
    type: 'string',
    enum: ['unpaid', 'paid', 'partial'],
  },
  ParcelCore: {
    $id: '#ParcelCore',
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      parcelRef: { type: 'string' },
      receiveDate: { type: 'string', format: 'date-time' },
      customerCode: { type: 'string' },
      shipment: { type: 'string' },
      estimate: { type: 'number' },
      status: { $ref: '#ParcelStatus' },
      cnTracking: { type: 'string' },
      volume: { type: 'number' },
      weight: { type: 'number' },
      freight: { type: 'number' },
      deliveryMethod: { type: 'string' },
      thTracking: { type: 'string' }, // Optional: not in required list
      paymentStatus: { $ref: '#PaymentStatus' },
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
      // thTracking is optional
      'paymentStatus',
      'createdAt',
      'updatedAt',
    ],
  },
};

export const ListParcelsQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    status: {
      anyOf: [
        { $ref: 'definitions#ParcelStatus' },
        { type: 'string', const: 'all' },
      ],
    },
    paymentStatus: {
      anyOf: [
        { $ref: 'definitions#PaymentStatus' },
        { type: 'string', const: 'all' },
      ],
    },
    trackingNo: { type: 'string' },
    dateFrom: { type: 'string', format: 'date' },
    dateTo: { type: 'string', format: 'date' },
    customerCode: { type: 'string' },
  },
};

export const ListParcelsResponseSchema = {
  type: 'object',
  properties: {
    parcels: {
      type: 'array',
      items: { $ref: 'definitions#ParcelCore' },
    },
    total: { type: 'integer' },
    page: { type: 'integer' },
    pageSize: { type: 'integer' },
  },
  required: ['parcels', 'total', 'page', 'pageSize'],
};

export const GetParcelByIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
  required: ['id'],
};

export const GetParcelByIdResponseSchema = { $ref: 'definitions#ParcelCore' };

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
    status: { $ref: 'definitions#ParcelStatus' },
    notify: { type: 'boolean', default: false },
  },
  required: ['status'],
};

export const UpdateParcelStatusResponseSchema = { $ref: 'definitions#ParcelCore' };

export const ErrorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['statusCode', 'error', 'message'],
};
