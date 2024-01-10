import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn, OneToOne, JoinColumn, } from "typeorm";
import AppEvent from "./Event";
import { Ticket } from "./Ticket";

export enum device_status {
  REDY = 0,
  NEW = 1,
  BROKEN = 2,
}
@Entity('devices')
export default class Device {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  log_path: string

  @Column()
  device_id: string

  @Column('integer')
  status: device_status

  @Column()
  events_number: number

  @OneToOne(() => Ticket)
  @JoinColumn()
  ticket?: Ticket

  @OneToMany(() => AppEvent, (event) => event.device)
  events: AppEvent[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at?: Date
}