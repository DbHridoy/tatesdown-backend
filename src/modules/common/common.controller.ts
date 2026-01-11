import { CommonService } from "./common.service";
import { asyncHandler } from "../../utils/async-handler";
import { Request, Response, NextFunction } from "express";
import { HttpCodes } from "../../constants/status-codes";
import { logger } from "../../utils/logger";

export class CommonController {
  constructor(private commonService: CommonService) { }



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
      logger.info({ clusterName }, 'CommonController.createCluster');
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
      return res.status(200).json({ success: true, message: "Clusters fetched successfully", data: clusters });
    }
  );

  getNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const q = req.query
      const notifications = await this.commonService.getNotification(q)
      res.status(HttpCodes.Ok).send({
        success: true,
        message: "Notification fetched successfully",
        data: notifications
      })
    }
  )
}
