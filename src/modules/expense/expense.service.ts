import { MileageInfo } from "./expense.interface";
import { ExpenseRepository } from "./expense.repository";

export class ExpenseService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}
  createNewMileage = async (mileageInfo: MileageInfo) => {
    return await this.expenseRepository.createNewMileage(mileageInfo);
  };
  getAllMileage = async () => {
    return await this.expenseRepository.getAllMileage();
  };
  getMileageById = async (id: string) => {
    return await this.expenseRepository.getMileageById(id);
  };
}
