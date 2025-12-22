import Mileage from "./mileage.model";

export class ExpenseRepository {
  createNewMileage = async (mileageInfo: object) => {
    const newMileage = new Mileage(mileageInfo);
    return await newMileage.save();
  };

  getAllMileage = async () => {
    return await Mileage.find();
  };
  getMyMileage = async (userId: string) => {
    return await Mileage.find({ salesRepId: userId }).populate("salesRepId");
  };

  getMileageById = async (id: string) => {
    return await Mileage.findById(id);
  };
}
