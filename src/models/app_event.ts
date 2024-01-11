import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, BaseEntity } from "typeorm";
import { Device } from "./device";
// import { User } from "./user";

export enum EventType {
  LOG = 0,
  PRINT = 1,
  UPDATE = 2
}

@Entity('events')
export class AppEvent extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  description?: string

  @Column('integer')
  type: EventType

  @ManyToOne(() => Device, device => device.events)
  device?: Device

  // @ManyToOne(() => User, u => u.events, { nullable: true })
  // created_by?: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
