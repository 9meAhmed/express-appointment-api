import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Appointment } from "./Appointment";

@Entity({ name: "appointment_logs" })
export class AppointmentLog {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.id)
  appointment!: Appointment;

  @Column({ nullable: false })
  status!: string;

  @Column({ nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
