import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Parcel } from './parcel.entity';

@Entity('status_histories')
export class StatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Parcel, (parcel) => parcel.statusHistories)
  @JoinColumn({ name: 'parcel_id' })
  parcel!: Parcel;

  @Column({
    type: 'enum',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
  })
  fromStatus!: Parcel['status'];

  @Column({
    type: 'enum',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
  })
  toStatus!: Parcel['status'];

  @Column({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ length: 100, name: 'updated_by' })
  updatedBy!: string;
}