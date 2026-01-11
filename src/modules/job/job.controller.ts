import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { JobService } from "./job.service";
import { HttpCodes } from "../../constants/status-codes";
import { logger } from "../../utils/logger";
import { SalesRep } from "../user/sales-rep.model";
import { Quote } from "../quote/quote.model";
import { Job } from "./job.model";
import { Client } from "../client/client.model";

export class JobController {
  constructor(private readonly jobService: JobService) {}

  createNewJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const jobInfo = req.body;
        const userId = req.user!.userId;

        // Find the sales rep
        const salesRep = await SalesRep.findOne({ userId });
        if (!salesRep) {
          return res.status(HttpCodes.NotFound).json({
            success: false,
            message: "Sales rep not found",
          });
        }

        // Attach salesRepId to the job
        const jobData = { ...jobInfo, salesRepId: salesRep._id };
        logger.info({ jobData }, "JobController.createNewJob");

        // Create the job
        const job = await Job.create(jobData);

        // If the job is based on a quote, update quote and client status
        if (jobInfo.quoteId) {
          const quote = await Quote.findByIdAndUpdate(
            jobInfo.quoteId,
            { status: "Approved" },
            { new: true }
          );

          if (quote?.clientId) {
            await Client.findByIdAndUpdate(quote.clientId, {
              leadStatus: "Job",
            });
            logger.info(
              { clientId: quote.clientId },
              "Client leadStatus updated to Job"
            );
          }

          logger.info({ quoteId: jobInfo.quoteId }, "Quote marked as Approved");
        }

        res.status(HttpCodes.Ok).json({
          success: true,
          message: "Job created successfully",
          data: job,
        });
      } catch (error) {
        logger.error(error, "JobController.createNewJob error");
        next(error);
      }
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
      if (req.file) {
        logger.info({ file: req.file }, "Jobcontroller.createJobNote");
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
      // logger.info({ jobId }, "JobController.getJobById");
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
      if (req.file) {
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

  getAllDownpaymentRequest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const params = req.query;
      const downpaymentRequest = await this.jobService.getAllDownpaymentRequest(
        params
      );
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All downpayment request fetched successfully",
        data: downpaymentRequest.downpaymentRequest,
        total: downpaymentRequest.total,
      });
    }
  );

  getAllJobCloseApproval = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const params = req.query;
      const jobCloseApproval = await this.jobService.getAllJobCloseApproval(
        params
      );
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All job close approval fetched successfully",
        data: jobCloseApproval.jobs,
        total: jobCloseApproval.total,
      });
    }
  );

  getAllJobBySalesRepId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { salesRepId } = req.params;
      const jobs = await this.jobService.getAllJobBySalesRepId(
        salesRepId,
        req.query
      );
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All job fetched successfully",
        data: jobs.jobs,
        total: jobs.total,
        totalEarning: jobs.totalEstimatedPrice,
      });
    }
  );
  // getAllPaymentBySalesRepId = asyncHandler(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //       const {salesRepId}=req.params
  //       const payments=await this.jobService.getAllPaymentBySalesRepId(salesRepId)
  //   }
  // );

  updateDownpaymentStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id, status } = req.body;
      logger.info({ id, status }, "JobController.updateDownpaymentStatus");
      const result = await this.jobService.updateDownpaymentStatus(id, status);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Downpayment status updated successfully",
        data: result,
      });
    }
  );
}
