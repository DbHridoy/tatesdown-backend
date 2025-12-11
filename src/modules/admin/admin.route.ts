import { Router } from "express";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

const adminRoute=Router()

const adminRepo=new AdminRepository()
const adminService=new AdminService(adminRepo)
const adminController=new AdminController(adminService)
const autMiddleware=new AuthMiddleware()


adminRoute.post("/create-user",autMiddleware.authenticate,autMiddleware.authorize("admin"),adminController.createUser)

export default adminRoute