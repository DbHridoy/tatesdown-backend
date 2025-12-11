import { Types } from "mongoose";
import productionManager from "./production-manager.model";

export class ProductionManagerRepository {
  createProductionManager = async (userId: Types.ObjectId) => {
    const newUser = new productionManager({ userId });
    return await newUser.save();
  };
}
