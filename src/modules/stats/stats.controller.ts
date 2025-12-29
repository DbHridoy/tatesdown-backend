import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { StatsService } from "./stats.service";

export class StatsController {
  constructor(private statsService: StatsService) {}
  getAdminStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const stats = await this.statsService.getAdminStats();
      res.status(200).json({
        success: true,
        message: "Admin stats retrieved successfully",
        data: stats,
      });
    }
  );
  getSalesRepStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {salesRepId}=req.params
        const stats=await this.statsService.getSalesRepStats(salesRepId)
        res.status(200).json({
            success:true,
            message:"Sales rep stats retrieved successfully",
            data:stats
        })
    }
  );
}
