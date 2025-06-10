import { FindOptionsWhere, Between, Repository } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { Parcel } from '../../entities/parcel.entity';
import {
  ListParcelsQuery,
  ParcelCore,
  ListParcelsResponse,
  ParcelStatus,
} from './parcel.types';

export class ParcelService {
  private parcelRepository: Repository<Parcel>;

  constructor() {
    this.parcelRepository = AppDataSource.getRepository(Parcel);
  }

  async findMany(query: ListParcelsQuery): Promise<{ parcels: Parcel[]; total: number }> {
    const {
      page = 1,
      pageSize = 10,
      status,
      trackingNo,
      dateFrom,
      dateTo,
      customerCode,
    } = query;

    let queryBuilder = this.parcelRepository
      .createQueryBuilder('parcel')
      .leftJoinAndSelect('parcel.customer', 'customer')
      .leftJoinAndSelect('parcel.carrier', 'carrier');

    if (customerCode) {
      queryBuilder.andWhere('customer.customerCode = :customerCode', { customerCode });
    }
    if (status && status !== 'all') {
      queryBuilder.andWhere('parcel.status = :status', { status });
    }
    if (dateFrom && dateTo) {
      queryBuilder.andWhere('parcel.receiveDate BETWEEN :from AND :to', {
        from: new Date(dateFrom),
        to: new Date(dateTo),
      });
    } else if (dateFrom) {
      queryBuilder.andWhere('parcel.receiveDate >= :from', { from: new Date(dateFrom) });
    } else if (dateTo) {
      queryBuilder.andWhere('parcel.receiveDate <= :to', { to: new Date(dateTo) });
    }
    if (trackingNo) {
      queryBuilder.andWhere(
        '(parcel.tracking ILIKE :trackingNo OR parcel.containerCode ILIKE :trackingNo OR parcel.parcelRef ILIKE :trackingNo)',
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

    parcel.status = newStatus;

    const updatedParcel = await this.parcelRepository.save(parcel);

    if (notify) {
      console.log(`INFO: Parcel ${updatedParcel.id} status updated to ${updatedParcel.status}. Notify flag set to ${notify}.`);
    }

    return updatedParcel;
  }


  toResponse(parcel: Parcel): ParcelCore {
    return {
      id: parcel.id,
      parcelRef: parcel.parcelRef,
      receiveDate: parcel.receiveDate.toISOString(),
      description: parcel.description,
      pack: parcel.pack,
      weight: Number(parcel.weight),
      length: parcel.length,
      width: parcel.width,
      height: parcel.height,
      cbm: Number(parcel.cbm),
      tracking: parcel.tracking,
      containerCode: parcel.containerCode,
      estimatedDate: parcel.estimatedDate?.toISOString(),
      status: parcel.status,
      customerCode: parcel.customer.customerCode,
      carrierId: parcel.carrier?.id,
      createdAt: parcel.createdAt.toISOString(),
      updatedAt: parcel.updatedAt.toISOString(),
    };
  }

  toListResponse(parcels: Parcel[], total: number, page: number, pageSize: number): ListParcelsResponse {
    return {
      parcels: parcels.map(p => this.toResponse(p)),
      total,
      page,
      pageSize
    };
  }
}
