import User from "./user.model";

export default class UserRepository {
  createUser = async (userBody: any) => {
    const newUser = new User(userBody);
    return newUser.save();
  };
}
