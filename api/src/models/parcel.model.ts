import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('parcels')
export class Parcel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  parcelRef!: string;

  @Column({ type: 'timestamp with time zone' })
  receiveDate!: Date;

  @Column({ type: 'varchar', length: 255 })
  customerCode!: string;

  @Column({ type: 'varchar', length: 255 })
  shipment!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  estimate!: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status!: 'pending' | 'shipped' | 'delivered' | 'cancelled';

  @Column({ type: 'varchar', length: 255, name: 'cn_tracking' })
  cnTracking!: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  volume!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
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
