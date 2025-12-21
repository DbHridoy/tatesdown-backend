import { UserRepository } from "./user.repository";
import { logger } from "../../utils/logger";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { container } from "../../container";
import { createUserType } from "./user.type";

export class UserService {
  private hashUtils = container.hasUtils;
  private mailerUtils = container.mailerUtils;
  constructor(private userRepo: UserRepository) {}
  getUserProfile = async (id: string) => {
    return await this.userRepo.findUserById(id);
  };
  updateProfile = async (id: string, body: any) => {
    return await this.userRepo.updateProfile(id, body);
  };
  createUser = async (userBody: createUserType) => {
    const existingUser = await this.userRepo.findUserByEmail(userBody.email);

    if (existingUser) {
      throw new apiError(
        Errors.AlreadyExists.code,
        Errors.AlreadyExists.message
      );
    }

    const hashedPassword = await this.hashUtils.hashPassword(userBody.password);
    logger.info({ hashedPassword }, "HashedPassword");

    const user = {
      ...userBody,
      password: hashedPassword,
    };

    logger.info({ user }, "user");

    const newUser = await this.userRepo.createUser(user);
    //await this.mailerUtils.sendPassword(userBody.email, userBody.password);

    return newUser;
  };
}
