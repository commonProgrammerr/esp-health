import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  BaseEntity,
  PrimaryColumn
} from "typeorm";

import { AppEvent } from "./app_event";
import { DeviceStatus } from "../utils/enums";

@Entity('devices')
export class Device extends BaseEntity {

  @PrimaryColumn()
  id: string

  @Column('integer', { default: DeviceStatus.NEW })
  status: DeviceStatus

  @OneToMany(() => AppEvent, (event) => event.device)
  events: AppEvent[]

  @Column({ default: 0 })
  events_number: number

  @Column({ nullable: true })
  log_path: string

  @Column({ nullable: true })
  ticket_path?: string

  @Column({ default: 0, nullable: false })
  ticket_downloads: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date
}
