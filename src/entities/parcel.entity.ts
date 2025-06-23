import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Carrier } from './carrier.entity';
import { Payment } from './payment.entity';
import { StatusHistory } from './status-history.entity';

@Entity('parcels')
export class Parcel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true, name: 'parcel_ref' })
  parcelRef!: string;

  @Column({ type: 'timestamp with time zone', name: 'receive_date' })
  receiveDate!: Date;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'int' })
  pack!: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  weight!: number;

  @Column({ type: 'int' })
  length!: number;

  @Column({ type: 'int' })
  width!: number;

  @Column({ type: 'int' })
  height!: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  cbm!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tracking?: string;

  @Column({ type: 'varchar', length: 50, name: 'container_code', nullable: true })
  containerCode?: string;

  @Column({ type: 'timestamp with time zone', name: 'estimated_date', nullable: true })
  estimatedDate?: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status!: 'pending' | 'shipped' | 'delivered' | 'cancelled';

  @ManyToOne(() => User, (user) => user.parcels)
  @JoinColumn({ name: 'customer_id' })
  customer!: User;

  @ManyToOne(() => Carrier, (carrier) => carrier.parcels, { nullable: true })
  @JoinColumn({ name: 'carrier_id' })
  carrier?: Carrier;

  @OneToMany(() => StatusHistory, (hist) => hist.parcel)
  statusHistories!: StatusHistory[];

  @OneToMany(() => Payment, (payment) => payment.parcel)
  payments!: Payment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}