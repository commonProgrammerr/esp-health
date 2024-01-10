import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import AppEvent from "./Event";

@Entity('device')
export default class Device {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  mac?: string

  @Column()
  pass_rate?: number

  @OneToMany(() => AppEvent, (event) => event.device)
  events: AppEvent[]

}