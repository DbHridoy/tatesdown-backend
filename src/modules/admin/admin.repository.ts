import { Types } from "mongoose";
import Admin from "./admin.model";

export class AdminRepository{
    createAdmin = async (userId: Types.ObjectId) => {
    const newUser = new Admin({ userId });
    return await newUser.save();
  };
}