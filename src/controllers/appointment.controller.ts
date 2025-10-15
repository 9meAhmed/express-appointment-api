import { AppointmentStatus } from "../enum/appointment-status.enum";
import { Request, Response } from "express";
import {
  appointmentRepository,
  appointmentLogRepository,
  patientRepository,
  doctorRepository,
} from "../repository";
import Mailer from "../helpers/mailer.helper";
import { Appointment } from "../entity/Appointment";
export class AppointmentController {
  static async getAllAppointments(req: Request, res: Response) {
    const { query } = req;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let whereParams = {};

    if (query.doctorId) {
      const doctorId = Number(query?.doctorId);
      whereParams = {
        ...whereParams,
        doctor: { id: doctorId },
      };
    }

    if (query.patientId) {
      const patientId = Number(query?.patientId);
      whereParams = {
        ...whereParams,
        patient: { id: patientId },
      };
    }

    if (query.status) {
      whereParams = {
        ...whereParams,
        status: query.status,
      };
    }

    const appointments = await appointmentRepository.findAll(
      whereParams,
      skip,
      limit
    );
    res.json(appointments);
  }

  static async createAppointment(req: Request, res: Response) {
    const { patientId, doctorId, dateTime } = req.body;
    const patient = await patientRepository.findById(patientId);
    const doctor = await doctorRepository.findById(doctorId);

    const appointment = await appointmentRepository.createAppointment({
      ...req.body,
      patient,
      doctor,
      dateTime: new Date(dateTime),
    });

    await appointment.createAppointmentLog();

    AppointmentController.sendAppointmentEmail(appointment);

    res.status(201).json(appointment);
  }

  static async updateAppointment(req: Request, res: Response) {
    const appointmentId = Number(req.params.id);
    const appointment = await appointmentRepository.updateAppointment(
      appointmentId,
      req.body
    );
    await appointment.createAppointmentLog();
    AppointmentController.sendAppointmentEmail(appointment);

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

  private static async sendAppointmentEmail(appointment: Appointment) {
    if (appointment.status === AppointmentStatus.BOOKED) {
      Mailer.sendMail(
        appointment.patient.user.email,
        "Appointment Confirmation",
        `Hello ${appointment.patient.user.firstName} ${appointment.patient.user.lastName}, \n\n Your appointment is confirmed for ${appointment.dateTime}.`
      );

      Mailer.sendMail(
        appointment.doctor.user.email,
        "New Appointment Scheduled",
        `Hello Dr. ${appointment.doctor.user.lastName}, \n\n A new appointment has been scheduled with ${appointment.patient.user.firstName} ${appointment.patient.user.lastName} for ${appointment.dateTime}.`
      );
    } else if (appointment.status === AppointmentStatus.CANCELLED) {
      Mailer.sendMail(
        appointment.patient.user.email,
        "Appointment Cancelled",
        `Hello ${appointment.patient.user.firstName} ${appointment.patient.user.lastName}, \n\n Your appointment has been cancelled. Please contact the clinic for more details.`
      );

      Mailer.sendMail(
        appointment.doctor.user.email,
        "Appointment Cancelled",
        `Hello Dr. ${appointment.doctor.user.lastName}, \n\n The appointment with ${appointment.patient.user.firstName} ${appointment.patient.user.lastName} has been cancelled.`
      );
    } else if (appointment.status === AppointmentStatus.RESCHEDULED) {
      Mailer.sendMail(
        appointment.patient.user.email,
        "Appointment Rescheduled",
        `Hello ${appointment.patient.user.firstName} ${appointment.patient.user.lastName}, \n\n Your appointment has been rescheduled. Please contact the clinic for more details.`
      );

      Mailer.sendMail(
        appointment.doctor.user.email,
        "Appointment Rescheduled",
        `Hello Dr. ${appointment.doctor.user.lastName}, \n\n The appointment with ${appointment.patient.user.firstName} ${appointment.patient.user.lastName} has been rescheduled.`
      );
    }
  }
}
