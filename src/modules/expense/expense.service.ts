import { MileageInfo } from "./expense.interface";
import { ExpenseRepository } from "./expense.repository";
import { CommonService } from "../common/common.service";

export class ExpenseService {

  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly commonService: CommonService
  ) {}

  createNewMileage = async (mileageInfo: MileageInfo) => {
    const variable = await this.commonService.getVariable();
    if (!variable) {
      throw new Error("Mileage rate not set");
    }
    const deduction = variable?.mileageRate * mileageInfo.totalMilesDriven;
    return await this.expenseRepository.createNewMileage({
      ...mileageInfo,
      deduction,
      status:"pending",
    });
  };

  getAllMileage = async () => {
    return await this.expenseRepository.getAllMileage();
  };
  getMyMileage=async(userId:string)=>{
    return await this.expenseRepository.getMyMileage(userId)
  }

  getMileageById = async (id: string) => {
    return await this.expenseRepository.getMileageById(id);
  };

}
