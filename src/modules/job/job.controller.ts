import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { JobService } from "./job.service";
import { HttpCodes } from "../../constants/status-codes";
import { logger } from "../../utils/logger";

export class JobController {
  constructor(private readonly jobService: JobService) {}

  createNewJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobInfo = req.body;

      logger.info({ jobInfo }, "Jobcontroller.createNewJob");
      const job = await this.jobService.createNewJob(jobInfo);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    }
  );
  updateJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobId = req.params.jobId;
      const jobInfo = req.body;
      const job = await this.jobService.updateJobById(jobId, jobInfo);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job updated successfully",
        data: job,
      });
    }
  );
  deleteJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobId = req.params.jobId;
      const job = await this.jobService.deleteJobById(jobId);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job deleted successfully",
        data: job,
      });
    }
  );
  createJobNote = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobNote = req.body;
      if(req.file){
        jobNote.file = req.file.fileUrl;
      }
      const job = await this.jobService.createJobNote(jobNote);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job note created successfully",
        data: job,
      });
    }
  );
  getAllJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
      const job = await this.jobService.getAllJobs(query);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job fetched successfully",
        data: job.jobs,
        total: job.total,
      });
    }
  );
  getJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobId = req.params.jobId;
      const job = await this.jobService.getJobById(jobId);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job fetched successfully",
        data: job,
      });
    }
  );

  createNewDesignConsultation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const consultationBody = req.body;
      if(req.file){
        consultationBody.file = req.file.fileUrl;
      }
      const newDesignConsultation =
        await this.jobService.createNewDesignConsultation(consultationBody);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Design Consultation created successfully",
        data: newDesignConsultation,
      });
    }
  );

  getAllDesignConsultation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const allDesignConsultation =
        await this.jobService.getAllDesignConsultation();
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All Design Consultation fetched successfully",
        data: allDesignConsultation,
      });
    }
  );

  getDesignConsultationById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const designConsultation =
        await this.jobService.getDesignConsultationById(id);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Design Consultation fetched successfully",
        data: designConsultation,
      });
    }
  );
}
