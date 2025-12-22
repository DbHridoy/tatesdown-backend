import { CommonService } from "./common.service";
import { asyncHandler } from "../../utils/async-handler";
import { Request, Response, NextFunction } from "express";

export class CommonController {
  constructor(private commonService: CommonService) {}
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
}
