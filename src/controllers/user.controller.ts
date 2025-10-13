import { Request, Response } from "express";
import { userRepository } from "../repository";
import { userRoles } from "../enum/user-roles.enum";
import { Patient } from "../entity/Patient";
import Encrypt from "../helpers/encrypt.helper";
import { Doctor } from "../entity/Doctor";
import { patientRepository, doctorRepository } from "../repository";

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await userRepository.findAll();
    res.json(users);
  }

  static async createUser(req: Request, res: Response) {
    const user = await userRepository.createUser(req.body);

    if (user.role === userRoles.PATIENT) {
      const newPatient = new Patient();
      newPatient.user = user;
      newPatient.address = "";
      newPatient.mobile = "";
      await patientRepository.createPatient(newPatient);
    }

    if (user.role === userRoles.DOCTOR) {
      const newDoctor = new Doctor();
      newDoctor.user = user;
      newDoctor.designation = "";
      newDoctor.department = "";
      newDoctor.mobile = "";
      await doctorRepository.createDoctor(newDoctor);
    }

    res.status(201).json(user);
  }

  static async updateUser(req: Request, res: Response) {
    const userId = Number(req.params.id);

    if (req.body?.password) {
      req.body.password = await Encrypt.hashPassword(req.body.password);
    }
    const user = await userRepository.updateUser(userId, req.body);
    res.status(200).json(user);
  }

  static async deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const isDeleted = await userRepository.delete(userId);
    if (!isDeleted) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(null);
    }
  }
}
