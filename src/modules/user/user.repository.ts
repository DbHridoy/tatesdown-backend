import { Types } from "mongoose";
import User from "./user.model";

export default class UserRepository {
  createUser = async (userBody: any) => {
    const newUser = new User(userBody);
    return await newUser.save();
  };

  findUserById = async (id: string) => {
    return await User.findById(id);
  };

  findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
  };

  updateUserPassword = async (id: Types.ObjectId, hashedPassword: string) => {
    return User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  };
}
