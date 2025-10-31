import {
  AfterLoad,
  BeforeInsert,
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
import Encrypt from "../helpers/encrypt.helper";
import { existsSync, unlink } from "node:fs";

import * as dotenv from "dotenv";

dotenv.config();
const { APP_URL } = process.env;

@Entity({ name: "users" })
export class User {
  private profileImageDirPath = "/profilePicture/";
  public profileImageUrl: string;

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

  @Column({ nullable: true })
  otpCode: number | null;

  @Column({ nullable: true })
  otpCodeValidTill: Date | null;

  @Column({ nullable: true })
  profileImage?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Patient, (patient: Patient) => patient.user, {
    cascade: ["insert"],
  })
  patient: Patient;

  @OneToOne(() => Doctor, (doctor: Doctor) => doctor.user, {
    cascade: ["insert"],
  })
  doctor: Doctor;

  @BeforeInsert()
  async hashPassword() {
    this.password = await Encrypt.hashPassword(this.password);
  }

  @BeforeInsert()
  addOtpCodeAndValidTillDate() {
    this.otpCode = this.generateOtp();
    this.otpCodeValidTill = this.generateOtpValidTill();
  }

  @AfterLoad()
  concatProfilePictureUrl() {
    if (this.profileImage) {
      this.profileImageUrl =
        APP_URL + this.profileImageDirPath + this.profileImage;
    }
  }

  public generateOtp(): number {
    const otp = Math.floor(100000 + Math.random() * 900000);
    this.otpCode = otp;
    return otp;
  }

  public generateOtpValidTill(): Date {
    const otpValidTill = new Date(Date.now() + 5 * 60000); // 5 minutes from now
    this.otpCodeValidTill = otpValidTill;
    return otpValidTill;
  }

  public unlinkProfileImage(): void {
    if (this.profileImage !== null) {
      const path = "./uploads" + this.profileImageDirPath + this.profileImage;

      if (!existsSync(path)) {
        console.log(path + " file not found");
        return;
      }

      unlink(path, (err) => {
        if (err) throw err;
        console.log(path + " was deleted");
      });
    }
  }
}
