import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { logger } from "../../utils/logger";
import UserService from "./user.service";

export class UserController {
  constructor(private userService: UserService) {}
  createUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userBody = req.body
      logger.info(userBody, "userBody");
      const newUser = await this.userService.createUser(userBody)
      res.status(201).json({
        data:newUser
      });
    }
  );
}
