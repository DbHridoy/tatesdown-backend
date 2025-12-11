import UserRepository from "./user.repository";
import { logger } from "../../utils/logger";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { container } from "../../container";
import bcrypt from "bcrypt";

export default class UserService {
  private hashUtils = container.hasUtils;
  private jwtUtils = container.jwtUtils;
  constructor(private userRepo: UserRepository) {}

 
}
