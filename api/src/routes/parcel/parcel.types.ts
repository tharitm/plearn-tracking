// TypeScript interfaces corresponding to JSON Schemas for internal type safety

export type ParcelStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'partial';

export interface ParcelCore {
  id: string;
  parcelRef: string;
  receiveDate: string; // ISO date-time string
  customerCode: string;
  shipment: string;
  estimate: number;
  status: ParcelStatus;
  cnTracking: string;
  volume: number;
  weight: number;
  freight: number;
  deliveryMethod: string;
  thTracking?: string; // Optional property
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO date-time string
  updatedAt: string; // ISO date-time string
}

export interface ListParcelsQuery {
  page?: number;
  pageSize?: number;
  status?: ParcelStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  trackingNo?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;   // YYYY-MM-DD
  customerCode?: string;
}

export interface ListParcelsResponse {
  parcels: ParcelCore[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetParcelByIdParams {
  id: string;
}

export interface UpdateParcelStatusParams {
  id: string;
}

export interface UpdateParcelStatusBody {
  status: ParcelStatus;
  notify?: boolean;
}

// Generic Error type if needed for internal use, though ErrorSchema is for responses
export interface ErrorResponseType {
  statusCode: number;
  error: string;
  message: string;
}
