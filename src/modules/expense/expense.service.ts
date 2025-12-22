import { MileageInfo } from "./expense.interface";
import { ExpenseRepository } from "./expense.repository";

export class ExpenseService {

  constructor(private readonly expenseRepository: ExpenseRepository) {}
  createNewMileage = async (mileageInfo: MileageInfo) => {
    // const variable = await this.variableRepository.getVariables();
    // if (!variable) {
    //   throw new Error("Mileage rate not set");
    // }
    // const deduction = variable.mileagRate * mileageInfo.totalMilesDriven;
    return await this.expenseRepository.createNewMileage({
      ...mileageInfo
    });
  };
  getAllMileage = async () => {
    return await this.expenseRepository.getAllMileage();
  };
  getMileageById = async (id: string) => {
    return await this.expenseRepository.getMileageById(id);
  };
}
