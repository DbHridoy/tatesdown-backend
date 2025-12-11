import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { logger } from "../../utils/logger";
import UserService from "./user.service";

export class UserController {
  constructor(private userService: UserService) {}



}
