import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Parcel } from './parcel.entity';

@Entity('carriers')
export class Carrier {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 50 })
  code!: string;   // เช่น “EK”, “SCGL”

  @Column({ length: 255 })
  name!: string;

  @OneToMany(() => Parcel, (parcel) => parcel.carrier)
  parcels!: Parcel[];
}