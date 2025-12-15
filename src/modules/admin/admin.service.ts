import { Errors } from "../../constants/error-codes";
import { apiError } from "../../errors/api-error";
import {UserRepository} from "../user/user.repository";
import { AdminRepository } from "./admin.repository";

export class AdminService {
  private userRepo = new UserRepository();
  constructor(private adminRepo: AdminRepository) {}

  createUser = async (userBody: any) => {
    const { email } = userBody;

    const existingUser = await this.userRepo.findUserByEmail(email);

    if (existingUser) {
      throw new apiError(
        Errors.AlreadyExists.code,
        Errors.AlreadyExists.message
      );
    }

    const newUser = await this.userRepo.createUser(userBody);
    return newUser;
  };
}
