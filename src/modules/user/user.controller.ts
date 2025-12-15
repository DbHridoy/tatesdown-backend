import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { logger } from "../../utils/logger";
import { UserService } from "./user.service";
import { HttpCodes } from "../../constants/status-codes";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { updateOtherRoleUserType } from "./user.type";
import { TypedRequestBody } from "../../types/request.type";

export class UserController {
  constructor(private userService: UserService) {}

  updateProfile = asyncHandler(
    async (
      req: TypedRequestBody<updateOtherRoleUserType>,
      res: Response,
      next: NextFunction
    ) => {
      const body = req.body;
      const id = req.user?.userId;
      logger.info(req.user , "User from usercontroller");
      logger.info(body , "Body from usercontroller");
      if (!id) {
        throw new apiError(Errors.NotFound.code, Errors.NotFound.message);
      }
      const updatedUser = await this.userService.updateProfile(id, body);
      res.status(HttpCodes.Ok).json(updatedUser);
    }
  );
}
