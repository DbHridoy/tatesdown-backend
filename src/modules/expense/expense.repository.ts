import Mileage from "./mileage.model";

export class ExpenseRepository {
  createNewMileage = async (mileageInfo: object) => {
    const newMileage = new Mileage(mileageInfo);
    return await newMileage.save();
  };

  getAllMileage = async () => {
    const [mileage, total] = await Promise.all([
      Mileage.find(),
      Mileage.countDocuments(),
    ])
    return {data:mileage,total}
  };
getMyMileage = async (userId: string) => {
  // Fetch all mileage documents and total count in parallel
  const [mileage, total] = await Promise.all([
    Mileage.find({ salesRepId: userId }).populate("salesRepId"),
    Mileage.countDocuments({ salesRepId: userId }),
  ]);

  // Calculate total miles driven and total deduction
  const totalMilesDriven = mileage.reduce(
    (sum, doc) => sum + (doc.totalMilesDriven || 0),
    0
  );

  const totalDeduction = mileage.reduce(
    (sum, doc) => sum + (doc.deduction || 0),
    0
  );

  return {
    data: mileage,
    total,
    totalMilesDriven,
    totalDeduction,
  };
};



  getMileageById = async (id: string) => {
    const mileage=await Mileage.findById(id);
    return {data:mileage}
  };
}
