import { AppDataSource } from "../data-source";
import { Appointment } from "../entity/Appointment";
import { User } from "../entity/User";
import { UserService } from "../service/user.service";
import { AppointmentService } from "../service/appointment.service";
import { PatientService } from "../service/patient.service";
import { Patient } from "../entity/Patient";
import { DoctorService } from "../service/doctor.service";
import { Doctor } from "../entity/Doctor";

export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);

export const patientRepository = new PatientService(
  AppDataSource.getRepository(Patient)
);

export const doctorRepository = new DoctorService(
  AppDataSource.getRepository(Doctor)
);

export const appointmentRepository = new AppointmentService(
  AppDataSource.getRepository(Appointment)
);
