import { Repository } from "typeorm";
import { AppointmentLog } from "../entity/AppointmentLog";

export class AppointmentLogService {
  constructor(private appointmentLogRepository: Repository<AppointmentLog>) {}

  async findAll(whereParams, skip, limit): Promise<AppointmentLog[]> {
    return this.appointmentLogRepository.find({
      where: { ...whereParams },
      relations: ["appointment"],
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });
  }

  async findById(id: string): Promise<AppointmentLog | null> {
    return this.appointmentLogRepository.findOne({
      where: { id },
      relations: ["appointment"],
    });
  }

  async createAppointmentLog(
    appointmentLog: AppointmentLog
  ): Promise<AppointmentLog> {
    const newAppointmentLog = this.appointmentLogRepository.create({
      ...appointmentLog,
    });
    await this.appointmentLogRepository.save(newAppointmentLog);
    return newAppointmentLog;
  }
}
