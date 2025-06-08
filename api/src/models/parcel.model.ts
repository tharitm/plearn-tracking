import { getDbConnection } from '../config/database';
import { Parcel } from '../types/parcel.types';

export async function getAllParcels(): Promise<Parcel[]> {
  const db = await getDbConnection();
  // The 'as Parcel[]' cast is used here.
  // Ideally, you would have runtime validation (e.g., with Zod) to ensure
  // the data from the DB matches the Parcel interface.
  // For this example, we'll assume the data is correct.
  const parcels = await db.all<Parcel[]>('SELECT * FROM parcels');
  return parcels;
}

export async function getParcelById(id: string): Promise<Parcel | undefined> {
  const db = await getDbConnection();
  // Similar to getAllParcels, runtime validation would be good practice.
  const parcel = await db.get<Parcel>('SELECT * FROM parcels WHERE id = ?', id);
  return parcel;
}

// Future functions like createParcel, updateParcel, deleteParcel could be added here.
// For example:
/*
export async function createParcel(newParcel: Omit<Parcel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Parcel> {
  const db = await getDbConnection();
  const id = crypto.randomUUID(); // Requires node:crypto
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const result = await db.run(
    `INSERT INTO parcels (
      id, parcelRef, receiveDate, customerCode, shipment, estimate, status,
      cnTracking, volume, weight, freight, deliveryMethod, thTracking,
      paymentStatus, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    newParcel.parcelRef,
    newParcel.receiveDate,
    newParcel.customerCode,
    newParcel.shipment,
    newParcel.estimate,
    newParcel.status,
    newParcel.cnTracking,
    newParcel.volume,
    newParcel.weight,
    newParcel.freight,
    newParcel.deliveryMethod,
    newParcel.thTracking,
    newParcel.paymentStatus,
    createdAt,
    updatedAt
  );

  // The lastID is not available on result for `run` with `sqlite` package when statement is prepared by user.
  // A SELECT query would be needed to get the newly created parcel.
  // This is a simplified example.
  const createdParcel = await getParcelById(id);
  if (!createdParcel) {
    throw new Error('Failed to create or retrieve parcel');
  }
  return createdParcel;
}
*/
