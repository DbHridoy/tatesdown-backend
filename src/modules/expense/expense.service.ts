import { ExpenseRepository } from "./expense.repository";
import { CommonService } from "../common/common.service";

export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly commonService: CommonService
  ) { }

  createNewMileage = async (mileageInfo: any) => {
    const variable = await this.commonService.getVariable();
    if (!variable) {
      throw new Error("Mileage rate not set");
    }
    const deduction = variable?.mileageRate * mileageInfo.totalMilesDriven;
    return await this.expenseRepository.createNewMileage({
      ...mileageInfo,
      deduction,
    });
  };

  getAllMileage = async (query: any) => {
    return await this.expenseRepository.getAllMileage(query);
  };

  getPendingMileage = async (query: any) => {
    return await this.expenseRepository.getPendingMileage(query);
  };

  getMyMileage = async (userId: string, query: any) => {
    return await this.expenseRepository.getMyMileage(userId, query);
  };

  getMileageById = async (id: string) => {
    return await this.expenseRepository.getMileageById(id);
  };

  updateMileage = async (mileageId: string, mileageInfo: any) => {
    return await this.expenseRepository.updateMileage(mileageId, mileageInfo);
  };


}
