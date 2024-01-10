import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import Device from "./Device";

export enum EventType {
  PRINT = 1,
  LOG_UPDATE = 3,
}

@Entity('events')
export default class AppEvent {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('integer')
  type: EventType

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  trigger?: any

  @ManyToOne(() => Device, device => device.events)
  device?: Device
}