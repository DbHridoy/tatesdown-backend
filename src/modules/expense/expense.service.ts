import { ExpenseRepository } from "./expense.repository";
import { CommonService } from "../common/common.service";
import { createNotification } from "../../utils/create-notification-utils";

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
    const existingMileage = await this.expenseRepository.getMileageById(
      mileageId
    );
    const updatedMileage = await this.expenseRepository.updateMileage(
      mileageId,
      mileageInfo
    );
    const previousStatus = existingMileage?.data?.status;
    const nextStatus = updatedMileage?.status;
    if (
      nextStatus === "Approved" &&
      previousStatus !== "Approved" &&
      updatedMileage?.salesRepId
    ) {
      await createNotification({
        forUser: updatedMileage.salesRepId.toString(),
        type: "mileage_approved",
        message: "Your mileage log has been approved",
      });
    }
    return updatedMileage;
  };


}
