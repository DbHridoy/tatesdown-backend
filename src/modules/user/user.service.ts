import {UserRepository} from "./user.repository";
import { logger } from "../../utils/logger";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { container } from "../../container";
import bcrypt from "bcrypt";

export  class UserService {
  private hashUtils = container.hasUtils;
  private jwtUtils = container.jwtUtils;
  constructor(private userRepo: UserRepository) {}
  updateProfile = async (id: string, body: any) => {
    return this.userRepo.updateProfile(id, body);
  };
}
