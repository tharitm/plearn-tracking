export interface Parcel {
  id: string;
  parcelRef: string;
  receiveDate: string; // Dates will be stored as TEXT in SQLite, can be parsed to Date objects
  customerCode: string;
  shipment: string;
  estimate: number;
  status: 'shipped' | 'pending' | 'delivered' | 'cancelled';
  cnTracking: string;
  volume: number;
  weight: number;
  freight: number;
  deliveryMethod: 'pickup' | 'delivery' | 'express';
  thTracking?: string; // Optional field
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  createdAt: string; // Dates will be stored as TEXT in SQLite
  updatedAt: string; // Dates will be stored as TEXT in SQLite
}
