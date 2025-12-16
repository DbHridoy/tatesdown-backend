import { Types } from "mongoose";
import User from "./user.model";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { ProductionManagerRepository } from "../production-manager/production-manager.repository";
import { AdminRepository } from "../admin/admin.repository";

export class UserRepository {
  private salesRepo = new SalesRepRepository();
  private productionManagerRepo = new ProductionManagerRepository();
  private adminRepo = new AdminRepository();

  createUser = async (userBody: any) => {
    const { role } = userBody;

    const newUser = new User(userBody);

    if (role === "sales-rep") {
      const newSalesRep = this.salesRepo.createSalesRep(newUser._id);
    } else if (role === "production-manager") {
      const newProductionManager =
        this.productionManagerRepo.createProductionManager(newUser._id);
    } else if (role === "admin") {
      const admin = this.adminRepo.createAdmin(newUser._id);
    } else {
      throw new apiError(Errors.EnumValue.code, Errors.EnumValue.message);
    }

    return await newUser.save();
  };

  findUserById = async (id: string) => {
    return await User.findById(id);
  };
  findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
  };

  updateUserPassword = async (id: Types.ObjectId, hashedPassword: string) => {
    return await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  };

  updateProfile = async (id: string, body: any) => {
    return await User.findByIdAndUpdate(id, body, { new: true });
  };
}
