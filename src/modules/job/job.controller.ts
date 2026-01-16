import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { JobService } from "./job.service";
import { HttpCodes } from "../../constants/status-codes";
import { logger } from "../../utils/logger";
import { SalesRep } from "../sales-rep/sales-rep.model";
import { Quote } from "../quote/quote.model";
import { Job } from "./job.model";
import { Client } from "../client/client.model";
import { DesignConsultation } from "./design-consultation.model";

export class JobController {
  constructor(private readonly jobService: JobService) { }

  createNewJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const jobInfo = req.body;
        const user = req.user!;

        const newJob = await this.jobService.createNewJob(jobInfo, user);

        res.status(HttpCodes.Ok).json({
          success: true,
          message: "Job created successfully",
          data: newJob,
        });
      } catch (error) {
        logger.error(error, "JobController.createNewJob line 29");
        next(error);
      }
    }
  );

  updateJobById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const jobId = req.params.jobId;
      const jobInfo = req.body;
      logger.info(jobInfo, "JobController.updateJobById line 39");
      const user = req.user!;
      const job = await this.jobService.updateJobById(jobId, jobInfo, user);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job updated successfully",
        data: job,
      });
    }
  );

  assignSalesRep = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const salesRepId = req.body.salesRepId
    const jobId = req.params.jobId
    const updatedJob = await this.jobService.assignSalesRep(salesRepId, jobId)
    res.status(HttpCodes.Ok).json({
      success: true,
      message: "Sales Rep assigned successfully",
      data: updatedJob
    })
  })

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
      logger.info({ jobNote }, "JobController.createJobNote line 74");
      const user = req.user!;
      if (req.file) {
        jobNote.file = req.file.fileUrl;
      }
      const job = await this.jobService.createJobNote(jobNote, user);
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

  createDesignConsultation = async (req: Request, res: Response) => {
    const {
      jobId,
      product,
      colorCode,
      estimatedGallons,
      upsellDescription,
      upsellValue,
      addedHours,
      estimatedStartDate,
    } = req.body;
    // logger.info({file:req.file},"JobController.createDesignConsultation")
    // 1️⃣ Create Design Consultation
    const designConsultation = await DesignConsultation.create({
      jobId,
      product,
      colorCode,
      estimatedGallons,
      upsellDescription,
      upsellValue,
      addedHours,
      estimatedStartDate,
      file: req.file?.fileUrl,
    });

    // 2️⃣ Update Job totals
    const job = await Job.findById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    // Add hours if upsell hours exist
    if (addedHours) {
      job.laborHours += Number(addedHours);
      job.totalHours += Number(addedHours);
    }

    // OPTIONAL: if gallons affect budget later
    if (estimatedGallons) {
      // Example logic — adjust if you calculate paint cost elsewhere
      // job.budgetSpent += estimatedGallons * PAINT_COST_PER_GALLON;
    }

    // Optional: update job status
    if (job.status === "Ready to Schedule") {
      job.status = "Ready to Schedule";
    }

    await job.save();

    res.status(201).json({
      success: true,
      data: designConsultation,
    });
  };

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
