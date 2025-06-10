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

  @Column({ length: 100 })
  firstName!: string;     // ชื่อ

  @Column({ length: 100 })
  lastName!: string;      // นามสกุล

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Parcel, (parcel) => parcel.customer)
  parcels!: Parcel[];
}