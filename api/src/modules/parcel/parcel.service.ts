import { FindManyOptions, FindOptionsWhere, ILike, Between, Repository } from 'typeorm';
import AppDataSource from '../../config/ormconfig';
import { Parcel } from './parcel.entity';
import { ListParcelsQueryType, ParcelCoreType, ListParcelsResponseType, ParcelStatusType, PaymentStatusType } from './parcel.schema'; // Added ParcelStatusType

export class ParcelService {
  private parcelRepository: Repository<Parcel>;

  constructor() {
    this.parcelRepository = AppDataSource.getRepository(Parcel);
  }

  async findMany(query: ListParcelsQueryType): Promise<{ parcels: Parcel[]; total: number }> {
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
    // Ensure that the status from the query (which can be 'all') is correctly cast or handled
    // if it's not 'all', it should match Parcel['status'] type.
    if (status && status !== 'all') whereConditions.status = status as Parcel['status'];
    if (paymentStatus && paymentStatus !== 'all') whereConditions.paymentStatus = paymentStatus as Parcel['paymentStatus'];

    if (dateFrom && dateTo) {
      whereConditions.receiveDate = Between(new Date(dateFrom), new Date(dateTo));
    } else if (dateFrom) {
      whereConditions.receiveDate = Between(new Date(dateFrom), new Date('9999-12-31'));
    } else if (dateTo) {
      // Corrected minimum date for 'Between'
      whereConditions.receiveDate = Between(new Date('0001-01-01'), new Date(dateTo));
    }

    let queryBuilder = this.parcelRepository.createQueryBuilder('parcel');

    // Apply known filters directly
    queryBuilder = queryBuilder.where(whereConditions);

    // Apply OR conditions for trackingNo
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

  async updateStatus(id: string, newStatus: ParcelStatusType, notify?: boolean): Promise<Parcel | null> {
    const parcel = await this.findOneById(id); // Use existing method
    if (!parcel) {
      return null;
    }

    parcel.status = newStatus;
    // parcel.updatedAt will be automatically handled by TypeORM's @UpdateDateColumn decorator

    const updatedParcel = await this.parcelRepository.save(parcel);

    if (notify) {
      // In a real application, you might emit an event or call a notification service here
      console.log(`INFO: Parcel ${updatedParcel.id} status updated to ${updatedParcel.status}. Notify flag set to ${notify}.`);
      // Example: await this.notificationService.sendParcelUpdate(updatedParcel);
    }

    return updatedParcel;
  }

  static toResponse(parcel: Parcel): ParcelCoreType {
    return {
      ...parcel,
      receiveDate: parcel.receiveDate.toISOString(),
      createdAt: parcel.createdAt.toISOString(),
      updatedAt: parcel.updatedAt.toISOString(),
      status: parcel.status as ParcelStatusType, // Cast to schema enum type
      paymentStatus: parcel.paymentStatus as PaymentStatusType, // Cast to schema enum type
      // Ensure numeric types that might be strings from DB are numbers
      estimate: Number(parcel.estimate),
      volume: Number(parcel.volume),
      weight: Number(parcel.weight),
      freight: Number(parcel.freight),
    };
  }

  static toListResponse(parcels: Parcel[], total: number, page: number, pageSize: number): ListParcelsResponseType {
    return {
      parcels: parcels.map(p => ParcelService.toResponse(p)),
      total,
      page,
      pageSize
    };
  }
}
