import { Repository } from "typeorm";
import { Appointment } from "../entity/Appointment";

export class AppointmentService {
  constructor(private appointmentRepository: Repository<Appointment>) {}

  async findAll(whereParams, skip, limit): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { ...whereParams },
      relations: ["patient.user", "doctor.user"],
      order: { dateTime: "DESC" },
      skip,
      take: limit,
    });
  }

  async findById(id: number): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ["patient.user", "doctor.user"],
    });
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
    const appointment = await this.findById(id);
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
