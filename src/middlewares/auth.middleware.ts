import { NextFunction, Request, Response } from "express";
import { apiError } from "../errors/api-error";
import { Errors } from "../constants/error-codes";
import { container } from "../container";
import { JwtPayload } from "jsonwebtoken";
import {UserRepository} from "../modules/user/user.repository";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        fullName: string;
        email: string;
        role: string;
      };
    }
  }
}

export class AuthMiddleware {
  private jwtUtils = container.jwtUtils;
  private authRepo = new UserRepository();

  // Authenticate middleware
  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new apiError(Errors.NoToken.code, Errors.NoToken.message);
      }

      const payload = this.jwtUtils.verifyAccessToken(
        accessToken
      ) as JwtPayload;

      if (!payload || !payload.userId) {
        throw new apiError(
          Errors.InvalidToken.code,
          Errors.InvalidToken.message
        );
      }

      const user = await this.authRepo.findUserById(payload.userId);
      if (!user) {
        throw new apiError(Errors.NotFound.code, Errors.NotFound.message);
      }

      req.user = {
        userId: payload.userId,
        fullName: payload.fullName,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  // Role-based authorization middleware
  authorize = (allowedRoles: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new apiError(
            Errors.Unauthorized.code,
            Errors.Unauthorized.message
          );
        }

        const roles = Array.isArray(allowedRoles)
          ? allowedRoles
          : [allowedRoles];
        if (!roles.includes(req.user.role)) {
          throw new apiError(Errors.Forbidden.code, Errors.Forbidden.message);
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
