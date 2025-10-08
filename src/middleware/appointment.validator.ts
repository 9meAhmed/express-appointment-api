import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { AppointmentDto } from "../dto/appointment.dto";

export const appointmentValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appointmentDto = plainToClass(AppointmentDto, req.body); // convert plain object to class instance and also do type conversion
  const errors: ValidationError[] = await validate(appointmentDto); // validate the class instance

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat();
    return res.status(400).json({ errors: errorMessages });
  } else {
    next();
  }
};
