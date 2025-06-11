import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Parcel } from './parcel.entity';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 }) // Combined length of firstName and lastName
  name!: string;           // ชื่อ - นามสกุล

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 20 })
  phone!: string;

  @Column({ unique: true, length: 50 })
  customerCode!: string;  // รหัสลูกค้า

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ length: 255 })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status!: 'active' | 'inactive';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Parcel, (parcel) => parcel.customer)
  parcels!: Parcel[];
}