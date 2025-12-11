import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { logger } from "../../utils/logger";
import { AuthService } from "./auth.service";
import { HttpCodes } from "../../constants/status-codes";
import { Errors } from "../../constants/error-codes";
import { env } from "../../config/env";
import { apiError } from "../../errors/api-error";

export class AuthController {
  constructor(private authService: AuthService) {}

  createUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userBody = req.body;
      logger.info(userBody, "userBody");
      const newUser = await this.authService.createUser(userBody);
      res.status(201).json({
        data: newUser,
      });
    }
  );

  loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;

      const user = await this.authService.loginUser(body.email, body.password);

      const { password, ...safeUser } = user.user.toObject();

      const data = {
        user: safeUser,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      };

      logger.info({ user }, "user from controller");

      // Access Token Cookie
      res.cookie("accessToken", user.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Response
      res.status(200).json({
        success: true,
        message: "Login successful",
        data,
      });
    }
  );

  // reset password
  sendOtp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;
      const result = await this.authService.sendOtp(email);
      logger.info(result);
      res.status(HttpCodes.Ok).json(result);
    }
  );

  verifyOtp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, otp } = req.body;
      const record = await this.authService.verifyOtp(email, otp);
      return res.status(HttpCodes.Ok).json(record);
    }
  );

  setNewPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, newPassword, confirmPassword } = req.body;

      // Basic validation
      if (!newPassword || !confirmPassword) {
        return res.status(HttpCodes.BadRequest).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(HttpCodes.BadRequest).json({
          success: false,
          message: "New password and confirm password do not match",
        });
      }

      // Call service
      const result = await this.authService.setNewPassword(email, newPassword);

      return res
        .status(result.success ? HttpCodes.Ok : HttpCodes.BadRequest)
        .json(result);
    }
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const accessToken = req.cookies?.accessToken;
      logger.info(accessToken, "from auth controller");
      if (!accessToken) {
        throw new apiError(Errors.NoToken.code, "Access token is required");
      }

      const result = await this.authService.refreshToken(accessToken);

      // Optionally update the cookie with new refresh token
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const responseData = {
        ...result,
      };

      res.status(HttpCodes.Ok).json(responseData);
    }
  );

  logout = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(HttpCodes.Ok).json({
        success: true,
        message: "Logged out successfully",
      });
    }
  );
}
