import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, DeleteDateColumn, OneToMany } from "typeorm";
import AppEvent from "./Event";


export enum UserRole {
  ADMIN = 0,
  LEADER = 1,
  USER = 2
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('integer')
  role: UserRole

  @Column()
  username: string

  @Column()
  password: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at?: Date

  @OneToMany(() => AppEvent, (event) => event.created_by)
  events: AppEvent[]
}