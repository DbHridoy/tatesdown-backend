import Mileage from "./mileage.model";

export class ExpenseRepository {
  createNewMileage = async (mileageInfo: object) => {
    const newMileage = new Mileage(mileageInfo);
    return await newMileage.save();
  };

  getAllMileage=async ()=>{
    return await Mileage.find()
  }

  getMileageById=async(id:string)=>{
    return await Mileage.findById(id)
  }
}
