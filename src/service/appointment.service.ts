import { Repository } from "typeorm";
import { Appointment } from "../entity/Appointment";

export class AppointmentService {
  constructor(private appointmentRepository: Repository<Appointment>) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  async findById(id: number): Promise<Appointment | null> {
    return this.appointmentRepository.findOneBy({ id });
  }

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    const newAppointment = this.appointmentRepository.create(appointment);
    await this.appointmentRepository.save(newAppointment);
    return newAppointment;
  }

  async updateAppointment(
    id: number,
    appointmentData: Partial<Appointment>
  ): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (!appointment) return null;

    this.appointmentRepository.merge(appointment, appointmentData);
    await this.appointmentRepository.save(appointment);
    return appointment;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.appointmentRepository.delete({ id });
    return result.affected !== 0;
  }
}
