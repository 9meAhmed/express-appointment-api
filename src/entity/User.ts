import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { userRoles } from "../enum/user-roles.enum";
import { Doctor } from "../entity/Doctor";
import { Patient } from "../entity/Patient";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: "enum", enum: userRoles, default: userRoles.PATIENT })
  role: userRoles;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Patient, (patient: Patient) => patient.user)
  patient: Patient;

  @OneToOne(() => Doctor, (doctor: Doctor) => doctor.user)
  doctor: Doctor;
}
