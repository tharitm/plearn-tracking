import { FindOptionsWhere, Between, Repository } from 'typeorm'; // Removed ILike as it's used in queryBuilder
import AppDataSource from '../../config/ormconfig';
import { Parcel } from '../../models/parcel.model';
// Import the new TypeScript interfaces and types
import {
  ListParcelsQuery,
  ParcelCore,
  ListParcelsResponse,
  ParcelStatus,
  PaymentStatus // Ensure PaymentStatus is also imported if used as a type
} from './parcel.types';

export class ParcelService {
  private parcelRepository: Repository<Parcel>;

  constructor() {
    this.parcelRepository = AppDataSource.getRepository(Parcel);
  }

  async findMany(query: ListParcelsQuery): Promise<{ parcels: Parcel[]; total: number }> { // Use new interface
    const {
      page = 1,
      pageSize = 10,
      status,
      paymentStatus,
      trackingNo,
      dateFrom,
      dateTo,
      customerCode,
    } = query;

    const whereConditions: FindOptionsWhere<Parcel> = {};

    if (customerCode) whereConditions.customerCode = customerCode;

    if (status && status !== 'all') whereConditions.status = status; // status is already ParcelStatus
    if (paymentStatus && paymentStatus !== 'all') whereConditions.paymentStatus = paymentStatus; // paymentStatus is already PaymentStatus

    if (dateFrom && dateTo) {
      whereConditions.receiveDate = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.receiveDate = Between(new Date(dateFrom), new Date('9999-12-31'));
    } else if (dateTo) {
      whereConditions.receiveDate = Between(new Date('0001-01-01'), new Date(dateTo));
    }

    let queryBuilder = this.parcelRepository.createQueryBuilder('parcel');
    queryBuilder = queryBuilder.where(whereConditions);

    if (trackingNo) {
      queryBuilder = queryBuilder.andWhere(
        '(parcel.cnTracking ILIKE :trackingNo OR parcel.thTracking ILIKE :trackingNo OR parcel.parcelRef ILIKE :trackingNo)',
        { trackingNo: `%${trackingNo}%` }
      );
    }

    const [parcels, total] = await queryBuilder
      .orderBy('parcel.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { parcels, total };
  }

  async findOneById(id: string): Promise<Parcel | null> {
    return this.parcelRepository.findOneBy({ id });
  }

  async updateStatus(id: string, newStatus: ParcelStatus, notify?: boolean): Promise<Parcel | null> { // Use new type
    const parcel = await this.findOneById(id);
    if (!parcel) {
      return null;
    }

    parcel.status = newStatus; // newStatus is already ParcelStatus

    const updatedParcel = await this.parcelRepository.save(parcel);

    if (notify) {
      console.log(`INFO: Parcel ${updatedParcel.id} status updated to ${updatedParcel.status}. Notify flag set to ${notify}.`);
    }

    return updatedParcel;
  }

  // Static methods to transform Parcel entity to response shapes
  // These now return the new interface types

  static toResponse(parcel: Parcel): ParcelCore { // Return ParcelCore interface
    return {
      ...parcel, // Spread the TypeORM entity
      receiveDate: parcel.receiveDate.toISOString(),
      createdAt: parcel.createdAt.toISOString(),
      updatedAt: parcel.updatedAt.toISOString(),
      // status and paymentStatus from entity should match ParcelStatus/PaymentStatus types
      // No explicit casting needed if entity types align with ParcelStatus/PaymentStatus
      estimate: Number(parcel.estimate),
      volume: Number(parcel.volume),
      weight: Number(parcel.weight),
      freight: Number(parcel.freight),
    };
  }

  static toListResponse(parcels: Parcel[], total: number, page: number, pageSize: number): ListParcelsResponse { // Return ListParcelsResponse interface
    return {
      parcels: parcels.map(p => ParcelService.toResponse(p)),
      total,
      page,
      pageSize
    };
  }
}
