import { AppDataSource } from "../data-source";
import { Appointment } from "../entity/Appointment";
import { User } from "../entity/User";
import { UserService } from "../service/user.service";
import { AppointmentService } from "../service/appointment.service";

export const userRepository = new UserService(
  AppDataSource.getRepository(User)
);
export const appointmentRepository = new AppointmentService(
  AppDataSource.getRepository(Appointment)
);
