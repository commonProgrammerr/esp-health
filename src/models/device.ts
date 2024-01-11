import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";

import { AppEvent } from "./app_event";

export enum device_status {
  REDY = 0,
  NEW = 1,
  BROKEN = 2,
}
@Entity('devices')
export class Device extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  log_path: string

  @Column({
    unique: true
  })
  device_id: string

  @Column('integer', { default: device_status.NEW })
  status: device_status

  @OneToMany(() => AppEvent, (event) => event.device)
  events: AppEvent[]

  @Column()
  events_number: number

  @Column()
  ticket_path: string

  @Column({ default: 0 })
  ticket_downloads: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date
}
