import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { ExpenseService } from "./expense.service";
import { MileageInfo } from "./expense.interface";

export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  createNewMileage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const mileageInfo = req.body;

      const newMileage = await this.expenseService.createNewMileage(
        mileageInfo as MileageInfo
      );

      return res.status(201).json({
        success: true,
        data: newMileage,
      });
    }
  );

  getAllMileage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const allMileage = await this.expenseService.getAllMileage();
      return res.status(200).json({
        success: true,
        data: allMileage,
      });
    }
  );
  getMileageById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const mileageId = req.params.mileageId;
      const mileage = await this.expenseService.getMileageById(mileageId);
      return res.status(200).json({
        success: true,
        data: mileage,
      });
    }
  );
}
