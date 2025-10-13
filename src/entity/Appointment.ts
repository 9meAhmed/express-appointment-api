import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";

@Entity({ name: "appointments" })
export class Appointment {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn()
  doctor!: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn()
  patient!: Patient;

  @Column({ nullable: false })
  dateTime!: Date;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
