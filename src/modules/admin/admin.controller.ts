import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { asyncHandler } from "../../utils/async-handler";
import { HttpCodes } from "../../constants/status-codes";
import { success } from "zod";

export class AdminController {
  constructor(private adminService: AdminService) {}

  createUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { fullName, email, role, password } = req.body;

      const user = await this.adminService.createUser({
        fullName,
        email,
        role,
        password,
      });

      res.status(HttpCodes.Ok).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    }
  );
}
