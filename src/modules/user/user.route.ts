import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CreateUserSchema, UpdateUserSchemaForOtherRoles } from "./user.schema";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";
import { authMiddleware, userController } from "../../container";

const userRoute = Router();

userRoute.post(
  "/create-user",
  validate(CreateUserSchema),
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin"]),
  userController.createUser
);

userRoute.get(
  "/get-user-profile",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin", "sales-rep", "production-manager"]),
  userController.getUserProfile
);

userRoute.patch(
  "/update-profile",
  authMiddleware.authenticate, // 1️⃣ auth first
  uploadFile({
    fieldName: "profileImage",
    uploadType: "single",
  }), // 2️⃣ parse FormData
  validate(UpdateUserSchemaForOtherRoles), // 3️⃣ validate text fields
  authMiddleware.authorize(["admin", "sales-rep", "production-manager"]),
  userController.updateProfile // 4️⃣ controller
);

export default userRoute;
