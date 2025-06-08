import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('parcels') // Specifies the table name
export class Parcel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  parcelRef!: string;

  @Column({ type: 'timestamp with time zone' }) // Or 'date' if time is not important
  receiveDate!: Date; // TypeORM typically works with Date objects

  @Column({ type: 'varchar', length: 255 })
  customerCode!: string;

  @Column({ type: 'varchar', length: 255 })
  shipment!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Assuming estimate is a monetary value
  estimate!: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status!: 'pending' | 'shipped' | 'delivered' | 'cancelled';

  @Column({ type: 'varchar', length: 255, name: 'cn_tracking' }) // snake_case for DB column
  cnTracking!: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 }) // Assuming volume can have 3 decimal places
  volume!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Assuming weight can have 2 decimal places
  weight!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  freight!: number;

  @Column({ type: 'varchar', length: 255 })
  deliveryMethod!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'th_tracking' })
  thTracking?: string;

  @Column({
    type: 'enum',
    enum: ['unpaid', 'paid', 'partial'],
    default: 'unpaid',
    name: 'payment_status'
  })
  paymentStatus!: 'unpaid' | 'paid' | 'partial';

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
