import * as express from "express";
import { AuthController } from "../controllers/auth.controller";
import { userValidator, loginValidator } from "../middleware/index";
import { resetPasswordValidator } from "../middleware/reset-password.validator";
const Router = express.Router();

Router.post("/login", loginValidator, AuthController.loginUser);
Router.post("/register", userValidator, AuthController.registerUser);
Router.post("/verify-otp", AuthController.verifyOtp);
Router.post("/resend-otp", AuthController.resendOtp);
Router.post("/forgot-password", AuthController.forgotPassword);
Router.post(
  "/reset-password",
  resetPasswordValidator,
  AuthController.resetPassword
);

export { Router as authRouter };
