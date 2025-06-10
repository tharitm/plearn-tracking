// TypeScript interfaces corresponding to JSON Schemas for internal type safety

export type ParcelStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'partial';

export interface ParcelCore {
  id: string;
  parcelRef: string;
  receiveDate: string;
  description: string;
  pack: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  cbm: number;
  tracking?: string;
  containerCode?: string;
  estimatedDate?: string;
  status: ParcelStatus;
  customerCode: string;
  carrierId?: string;
  createdAt: string;
  updatedAt: string;
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

export interface ErrorResponseType {
  statusCode: number;
  error: string;
  message: string;
}
