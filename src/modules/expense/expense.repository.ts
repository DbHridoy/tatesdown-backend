import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
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
    ]);
    return { data: mileage, total };
  };

  getMyMileage = async (userId: string, query: any) => {
    const { filter, search, options } = buildDynamicSearch(Mileage, query);
    const finalFilter = {
      ...filter,
      ...search,
      salesRepId: userId,
    };
    // Fetch all mileage documents and total count in parallel
    const [mileage, total] = await Promise.all([
      Mileage.find(finalFilter).populate("salesRepId"),
      Mileage.countDocuments(finalFilter),
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

  getPendingMileage = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Mileage, query);
    const finalFilter = {
      ...filter,
      ...search,
      status: "Pending",
    };
    const [mileage, total] = await Promise.all([
      Mileage.find(finalFilter).populate("salesRepId"),
      Mileage.countDocuments(finalFilter),
    ]);
    return { data: mileage, total };
  };

  getMileageById = async (id: string) => {
    const mileage = await Mileage.findById(id);
    return { data: mileage };
  };

  updateMileage = async (mileageId: string, mileageInfo: any) => {
    return await Mileage.findByIdAndUpdate(mileageId, mileageInfo, {
      new: true,
    });
  };


}
