import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from "typeorm";
import Device from "./Device";
import { User } from "./User";

export enum EventType {
  LOG = 0,
  PRINT = 1,
  UPDATE = 2
}

@Entity('events')
export default class AppEvent {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  descrition?: string

  @Column('integer')
  type: EventType

  @ManyToOne(() => Device, device => device.events)
  device?: Device

  @ManyToOne(() => User, u => u.events)
  created_by?: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}