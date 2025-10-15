import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";
import { AppointmentLog } from "./AppointmentLog";
import { appointmentLogRepository } from "../repository";

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

  @OneToMany(() => AppointmentLog, (appointmentLog) => appointmentLog.id)
  appointmentLogs!: AppointmentLog[];

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

  public async createAppointmentLog() {
    console.log("Creating appointment log for appointment id:", this.id);
    await appointmentLogRepository.createAppointmentLog({
      appointment: { ...this },
      status: this.status,
      remarks: this.remarks || "",
    });
  }
}
