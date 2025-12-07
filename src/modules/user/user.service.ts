import UserRepository from "./user.repository";
import bcrypt from "bcrypt";
import HashUtils from "../../utils/hash-utils";
import { logger } from "../../utils/logger";

export default class UserService {
  constructor(private userRepo: UserRepository, private hashUtils: HashUtils) {}

  createUser = async (userBody: { name: string; email: string; password: string }) => {
    const hashedPassword = await this.hashUtils.hashPassword(userBody.password);
    logger.info({ hashedPassword }, "HashedPassword");

    const user = {
      ...userBody,
      password: hashedPassword
    };

    logger.info({ user }, "user");

    const newUser = await this.userRepo.createUser(user);
    return newUser;
  };
}
