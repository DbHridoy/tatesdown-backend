import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { logger } from "../../utils/logger";
import { UserService } from "./user.service";
import { HttpCodes } from "../../constants/status-codes";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { updateOtherRoleUserType } from "./user.type";
import { TypedRequestBodyWithFile } from "../../types/request.type";

export class UserController {
  constructor(private userService: UserService) {}
getUserProfile=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const userId=req.user?.userId;
    if(!userId){
        throw new apiError(Errors.NotFound.code,Errors.NotFound.message)
    }
    const user=await this.userService.getUserProfile(userId);
    res.status(HttpCodes.Ok).json({
        success:true,
        message:"User profile fetched successfully",
        data:user
    })
})
  updateProfile = asyncHandler(
    async (
      req: TypedRequestBodyWithFile<updateOtherRoleUserType>,
      res: Response,
      next: NextFunction
    ) => {
      const userId = req.user?.userId;
      const body = req.body;

      if (!userId) {
        throw new apiError(Errors.NotFound.code, Errors.NotFound.message);
      }

      // If a file is uploaded, attach its URL to the body
      if (req.file) {
        body.profileImage = req.file.fileUrl;
      }

      logger.info({ user: req.user, body }, "Updating user profile");

      const updatedUser = await this.userService.updateProfile(userId, body);

      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    }
  );
}
