import { Request, Response } from "express";
import { appointmentRepository } from "../repository";
export class AppointmentController {
  static async getAllAppointments(req: Request, res: Response) {
    const appointments = await appointmentRepository.findAll();
    res.json(appointments);
  }

  static async createAppointment(req: Request, res: Response) {
    const appointment = await appointmentRepository.createAppointment(req.body);
    res.status(201).json(appointment);
  }

  static async updateAppointment(req: Request, res: Response) {
    const appointmentId = Number(req.params.id);
    const appointment = await appointmentRepository.updateAppointment(
      appointmentId,
      req.body
    );
    res.status(200).json(appointment);
  }

  static async deleteAppointment(req: Request, res: Response) {
    const appointmentId = Number(req.params.id);
    const isDeleted = await appointmentRepository.delete(appointmentId);
    if (!isDeleted) {
      res.status(404).json({ message: "Appointment not found" });
    } else {
      res.status(200).json(null);
    }
  }
}
