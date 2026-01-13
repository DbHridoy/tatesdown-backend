import { CommonService } from "./common.service";
import { asyncHandler } from "../../utils/async-handler";
import { Request, Response, NextFunction } from "express";
import { HttpCodes } from "../../constants/status-codes";
import { logger } from "../../utils/logger";
import { CommonRepository } from "./common.repository";

export class CommonController {
  constructor(
    private commonService: CommonService,
    private commonRepository: CommonRepository
  ) {}

  generateSequentialId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { prefix, counterName } = req.body;
      const id = await this.commonService.generateSequentialId(
        prefix,
        counterName
      );
      return res.status(200).json({ success: true, data: id });
    }
  );

  createCluster = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { clusterName } = req.body;
      logger.info({ clusterName }, "CommonController.createCluster");
      const cluster = await this.commonService.createCluster(clusterName);
      return res.status(200).json({ success: true, data: cluster });
    }
  );

  getVariable = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const variable = await this.commonService.getVariable();
      return res.status(200).json({ success: true, data: variable });
    }
  );

  upsertVariable = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const variables = req.body;
      const variable = await this.commonService.upsertVariable(variables);
      return res.status(200).json({ success: true, data: variable });
    }
  );

  getCluster = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const clusters = await this.commonService.getCluster();
      return res.status(200).json({
        success: true,
        message: "Clusters fetched successfully",
        data: clusters,
      });
    }
  );

  getNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const q = req.query;
      const notifications = await this.commonService.getNotification(q);
      res.status(HttpCodes.Ok).send({
        success: true,
        message: "Notification fetched successfully",
        data: notifications,
      });
    }
  );
  getAdminStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const stats = await this.commonService.getAdminStats();
      res.status(200).json({
        success: true,
        message: "Admin stats retrieved successfully",
        data: stats,
      });
    }
  );
  getSalesRepLeaderboard = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const stats = await this.commonService.getSalesRepLeaderboard();
      res.status(200).json({
        success: true,
        message: "Sales rep leaderboard retrieved successfully",
        data: stats,
      });
    }
  );
  getSalesRepStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { salesRepId } = req.params;
      const stats = await this.commonService.getSalesRepStats(salesRepId);
      res.status(200).json({
        success: true,
        message: "Sales rep stats retrieved successfully",
        data: stats,
      });
    }
  );

  createFiscalYear = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, startDate, endDate } = req.body;

      await this.commonRepository.deactivateAllFiscalYears();

      const fy = await this.commonRepository.createFiscalYear({
        name,
        startDate,
        endDate,
        isActive: true,
      });

      res.json(fy);
    }
  );

  getActiveFiscalYear = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const fy = await this.commonRepository.getActiveFiscalYear();
      res.json(fy);
    }
  );

  getStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { periodType } = req.query;

      const fiscalYear = await this.commonRepository.getActiveFiscalYear();
      if (!fiscalYear) return res.status(400).json({ message: "No FY" });

      const data = await this.commonRepository.findByPeriod({
        fiscalYearId: fiscalYear._id,
        periodType,
      });

      res.json(data);
    }
  );
}
