import { Types } from "mongoose";
import salesRep from "./sales-rep.model";

export class SalesRepRepository {
  createSalesRep = async (userId: Types.ObjectId) => {
    const newUser = new salesRep({ userId });
    return await newUser.save();
  };
}
