import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, BaseEntity } from "typeorm";
import { Device } from "./device";
import { EventType } from "../utils/enums";
// import { User } from "./user";

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
