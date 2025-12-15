import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {UserRepository} from "../user/user.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { createUserSchema, loginUserSchema } from "./auth.schema";
import { AuthRepository } from "./auth.repository";

const authRoute = Router();

// Dependency injection
const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService);

// Register route
authRoute.post(
  "/register",
  validate(createUserSchema),
  authController.createUser
);

authRoute.post("/login", validate(loginUserSchema), authController.loginUser);

authRoute.post("/send-otp", authController.sendOtp);
authRoute.post("/verify-otp", authController.verifyOtp);
authRoute.post("/set-new-password", authController.setNewPassword);
authRoute.post("/refresh-token", authController.refreshToken);
authRoute.post("/logout", authController.logout);

export default authRoute;
