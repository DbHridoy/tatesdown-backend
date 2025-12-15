import { Router } from "express";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { UpdateUserSchemaForOtherRoles } from "./user.schema";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";

const userRoute = Router();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);
const authMiddleware = new AuthMiddleware();

userRoute.post(
  "/update-profile",
  authMiddleware.authenticate, // 1️⃣ auth first
  uploadFile({
    fieldName: "profileImage",
    uploadType: "single",
  }), // 2️⃣ parse FormData
  validate(UpdateUserSchemaForOtherRoles), // 3️⃣ validate text fields
  userController.updateProfile // 4️⃣ controller
);

export default userRoute;
