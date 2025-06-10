import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Parcel } from './parcel.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Parcel, (parcel) => parcel.payments)
  @JoinColumn({ name: 'parcel_id' })
  parcel!: Parcel;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'timestamp with time zone', name: 'paid_at' })
  paidAt!: Date;

  @Column({ length: 50 })
  method!: string;   // เช่น “credit_card”, “bank_transfer”
}