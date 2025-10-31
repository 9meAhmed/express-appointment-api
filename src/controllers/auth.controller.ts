import { Request, Response } from "express";
import {
  doctorRepository,
  patientRepository,
  userRepository,
} from "../repository";
import Encrypt from "../helpers/encrypt.helper";
import { catchAsync } from "../helpers/catch-async.helper";
import { UserResponseDto } from "../dto/response/user.dto";
import Mailer from "../helpers/mailer.helper";
import { userRoles } from "../enum/user-roles.enum";
import { Patient } from "../entity/Patient";
import { Doctor } from "../entity/Doctor";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "referesh_token";

export class AuthController {
  static registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
    };

    const user = await userRepository.createUser(payload);

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

    if (user) {
      Mailer.sendMail(
        user.email,
        "Appointment System - OTP Verification",
        `Hello ${user.firstName} ${user.lastName},\n\nThank you for registering with us! Please verify your email with OTP: ${user.otpCode} \n\nBest regards,\nThe Team`
      );
    }

    res.status(201).json({ user: new UserResponseDto(user) });
  });

  static async verifyOtp(req: Request, res: Response) {
    const { email, otpCode } = req.body;
    const user = await userRepository.findByEmail(email);

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
      } else {
        const isOtpValid =
          user.otpCodeValidTill && new Date(user.otpCodeValidTill) > new Date();

        if (user.otpCode === Number(otpCode) && isOtpValid) {
          user.isVerified = true;
          user.otpCode = null;
          user.otpCodeValidTill = null;
          await userRepository.updateUser(user.id, user);

          res.status(200).json({ message: "User verified successfully" });
        } else {
          return res.status(400).json({ message: "Invalid OTP or expired" });
        }
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }

  static async resendOtp(req: Request, res: Response) {
    const { email } = req.body;
    const user = await userRepository.findByEmail(email);

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
      } else {
        user.generateOtp();
        user.generateOtpValidTill();
        await userRepository.updateUser(user.id, user);

        Mailer.sendMail(
          user.email,
          "Appointment System - OTP Verification",
          `Hello ${user.firstName} ${user.lastName},\n\nYour new OTP is: ${user.otpCode} \n\nBest regards,\nThe Team`
        );

        res.status(200).json({ message: "OTP resent successfully" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }

  static loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);

    if (user && !user.isVerified) {
      return res.status(403).json({ message: "Your account is not verified" });
    }

    if (!user || !(await Encrypt.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = await Encrypt.generateToken({ id: user.id });
    const refreshToken = await Encrypt.generateRefreshToken({ id: user.id });

    res.cookie(ACCESS_TOKEN_KEY, accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json(new UserResponseDto(user));
  });

  static async refreshToken(req: Request, res: Response) {
    const oldRefreshToken = req.cookies.refresh_token;

    if (!oldRefreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      const payload = await Encrypt.verifyToken(oldRefreshToken);

      const accessToken = await Encrypt.generateToken({ id: payload.id });
      const refreshToken = await Encrypt.generateRefreshToken({
        id: payload.id,
      });
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.status(200).json({ message: "Token refreshed successfully" });
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    const user = await userRepository.findByEmail(req.body.email);

    if (user) {
      user.generateOtp();
      user.generateOtpValidTill();
      const updatedUser = await userRepository.updateUser(user.id, {
        ...user,
      });

      Mailer.sendMail(
        user.email,
        "Appointment System - OTP Verification",
        `Hello ${updatedUser.firstName} ${updatedUser.lastName},\n\nThank you for registering with us! Please verify your email with OTP: ${updatedUser.otpCode} \n\nBest regards,\nThe Team`
      );

      res.status(200).json({ message: "OTP resent successfully", updatedUser });
    }

    res.status(404).json({ message: "User not found" });
  }

  static async resetPassword(req: Request, res: Response) {
    const user = await userRepository.findByEmail(req.body.email);

    if (user) {
      const isOtpValid =
        user.otpCodeValidTill && new Date(user.otpCodeValidTill) > new Date();

      if (user.otpCode === Number(req.body.otpCode) && isOtpValid) {
        const updatedUser = await userRepository.updateUser(user.id, {
          password: await Encrypt.hashPassword(req.body.password),
          otpCode: null,
          otpCodeValidTill: null,
        });

        Mailer.sendMail(
          user.email,
          "Appointment System - Password updated successfully",
          `Hello ${user.firstName} ${user.lastName},\n\nYour password has been updated successfully.\n\nBest regards,\nThe Team`
        );
        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      } else {
        return res.status(400).json({ message: "Invalid OTP or expired" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }

  static async profile(req: Request, res: Response) {
    const user = req.headers["user"] as any;

    const foundUser = await userRepository.findById(user.id);

    if (foundUser) {
      return res.status(200).json(new UserResponseDto(foundUser));
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie(ACCESS_TOKEN_KEY);
    res.clearCookie(REFRESH_TOKEN_KEY);
    res.status(200).json({ message: "Logged out successfully" });
  }
}
