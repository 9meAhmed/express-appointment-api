import express from "express";
import { authentification } from "../middleware/authentification";
import { authorization } from "../middleware/authorization";
import { userRoles } from "../enum/user-roles.enum";
import { userRepository } from "../repository";
import { AppointmentController } from "../controllers/appointment.controller";
import { appointmentValidator } from "../middleware/appointment.validator";

const Router = express.Router();

Router.get(
  "/appointment",
  authentification,
  authorization([userRoles.DOCTOR, userRoles.PATIENT]),
  AppointmentController.getAllAppointments
);

Router.post(
  "/appointment",
  authentification,
  authorization([userRoles.DOCTOR, userRoles.PATIENT]),
  appointmentValidator,
  AppointmentController.createAppointment
);

Router.put(
  "/appointment/:id",
  authentification,
  authorization([userRoles.DOCTOR, userRoles.PATIENT]),
  AppointmentController.updateAppointment
);

export { Router as appointmentRouter };
