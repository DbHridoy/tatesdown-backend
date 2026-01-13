import { Types } from "mongoose";
import User from "./user.model";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { logger } from "../../utils/logger";
import { SalesRep } from "../sales-rep/sales-rep.model";
import ProductionManager from "./production-manager.model";
import Admin from "./admin.model";

export class UserRepository {
  constructor(private buildDynamicSearch: any) {}
  createUser = async (userBody: any) => {
    logger.info({ userBody }, "UserRepository - createUser");

    const newUser = new User(userBody);
    await newUser.save();

    if (userBody.role === "Sales Rep") {
      await SalesRep.create({
        userId: newUser._id,
        cluster: userBody.cluster,
      });
    } else if (userBody.role === "Production Manager") {
      await ProductionManager.create({
        userId: newUser._id,
      });
    } else {
      await Admin.create({
        userId: newUser._id,
      });
    }

    return newUser;
  };

  getAllUsers = async (query: any) => {
    const { filter, search, options } = this.buildDynamicSearch(User, query);

    const baseQuery = {
      role: { $ne: "admin" },
      ...filter,
      ...search,
    };

    // Run both queries concurrently
    const [users, total] = await Promise.all([
      User.find(baseQuery, null, options).populate(
        "salesRep productionManager admin"
      ),
      User.countDocuments(baseQuery),
    ]);

    return { data: users, total };
  };

  deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
  };

  findUserById = async (id: string) => {
    return await User.findById(id).populate("salesRep productionManager admin");
  };

  findUserByEmail = async (email: string) => {
    return await User.findOne({ email }).populate(
      "salesRep productionManager admin"
    );
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
  getSalesReps = async (query: any) => {
    const { filter, search, options } = this.buildDynamicSearch(User, query);

    const baseQuery = {
      role: { $eq: "Sales Rep" },
      ...filter,
      ...search,
    };

    // Run both queries concurrently
    const [salesReps, total] = await Promise.all([
      User.find(baseQuery, null, options).populate(
        "salesRep productionManager admin"
      ),
      User.countDocuments(baseQuery),
    ]);

    return { data: salesReps, total };
  };
  updateUser = async (id: string, body: any) => {
    return await User.findByIdAndUpdate(id, body, { new: true });
  };
}
