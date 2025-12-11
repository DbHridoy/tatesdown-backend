import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { JobService } from "./job.service";
import { HttpCodes } from "../../constants/status-codes";

export class JobController {
  constructor(private readonly jobService: JobService) {}

  createNewJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobInfo = req.body;
      const job = await this.jobService.createNewJob(jobInfo);
      res.status(HttpCodes.Ok).json({ job });
    }
  );
  updateJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobId = req.params.jobId;
      const jobInfo = req.body;
      const job = await this.jobService.updateJobById(jobId, jobInfo);
      res.status(HttpCodes.Ok).json({ job });
    }
  );
  deleteJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobId = req.params.jobId;
      const job = await this.jobService.deleteJobById(jobId);
      res.status(HttpCodes.Ok).json({ job });
    }
  );
  createJobNote = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobNote = req.body;
      const job = await this.jobService.createJobNote(jobNote);
      res.status(HttpCodes.Ok).json({ job });
    }
  );
  getAllJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const job = await this.jobService.getAllJobs();
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job fetched successfully",
        job,
      });
    }
  );
  getJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobId = req.params.jobId;
      const job = await this.jobService.getJobById(jobId);
      res.status(HttpCodes.Ok).json({ job });
    }
  );
}
