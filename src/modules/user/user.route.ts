import { Router } from "express";
import { UserController } from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema } from "./user.schema";
import UserService from "./user.service";
import UserRepository from "./user.repository";
import HashUtils from "../../utils/hash-utils";

const userRoute = Router();

// Dependency injection
const userRepo = new UserRepository();
const hasUtils=new HashUtils()
const userService = new UserService(userRepo,hasUtils);
const userController = new UserController(userService);

// Test route
userRoute.get("/", (req, res) => {
  res.json({ message: "This is the user route" });
});

// Register route
userRoute.post(
  "/register",
  validate(createUserSchema),
  userController.createUser
);

export default userRoute;
