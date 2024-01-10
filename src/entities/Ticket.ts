import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, DeleteDateColumn, OneToMany } from "typeorm";
import AppEvent from "./Event";
import Device from "./Device";


@Entity('tickets')
export class Ticket {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  path: string

  @Column({ default: 0 })
  downloads: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}