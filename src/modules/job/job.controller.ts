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
import { Contract } from "./contract.model";

export class JobController {
  constructor(private readonly jobService: JobService) { }

  createJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const jobInfo = req.body;
        const user = req.user!;
        const contractUrl = req.file?.fileUrl;

        const newJob = await this.jobService.createJob(
          jobInfo,
          contractUrl,
          user
        );

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

  createDesignConsultation = async (req: Request, res: Response) => {
    const {
      clientId,
      jobId,
      product,
      colorCode,
      estimatedGallons,
      upsellDescription,
      upsellValue,
      addedHours,
      estimatedStartDate,
    } = req.body;
    const job = await Job.findById(jobId);
    const user = req.user!;

    if (!job) {
      throw new Error("Job not found");
    }

    const normalizeNumber = (value: unknown) => {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const updatePayload: any = {
      clientId: clientId || job.clientId,
      jobId,
      product,
      colorCode,
      estimatedGallons,
      upsellDescription,
      upsellValue,
      estimatedStartDate,
    };
    if (addedHours !== undefined) {
      updatePayload.addedHours = normalizeNumber(addedHours);
    }
    if (estimatedGallons !== undefined) {
      updatePayload.estimatedGallons = normalizeNumber(estimatedGallons);
    }
    if (upsellValue !== undefined) {
      updatePayload.upsellValue = String(upsellValue);
    }

    const designConsultation = await DesignConsultation.findOneAndUpdate(
      { jobId },
      updatePayload,
      { new: true, upsert: true }
    );

    if (req.file?.fileUrl) {
      await Contract.findOneAndUpdate(
        { designConsultationId: designConsultation._id },
        {
          createdBy: user.userId,
          clientId: job.clientId,
          contractUrl: req.file.fileUrl,
          jobId,
          designConsultationId: designConsultation._id,
        },
        { new: true, upsert: true }
      );
    }

    res.status(201).json({
      success: true,
      data: designConsultation,
    });
  };

  updateDesignConsultation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const existingDesignConsultation = await DesignConsultation.findById(id);
      if (!existingDesignConsultation) {
        throw new Error("Design consultation not found");
      }

      const job = await Job.findById(existingDesignConsultation.jobId);
      if (!job) {
        throw new Error("Job not found");
      }

      const user = req.user!;
      const {
        clientId,
        product,
        colorCode,
        estimatedGallons,
        upsellDescription,
        upsellValue,
        addedHours,
        estimatedStartDate,
      } = req.body;

      const normalizeNumber = (value: unknown) => {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? 0 : parsed;
      };

      const updatePayload: any = {
        clientId: clientId || job.clientId,
        jobId: job._id,
        product,
        colorCode,
        upsellDescription,
        estimatedStartDate,
      };

      if (addedHours !== undefined) {
        updatePayload.addedHours = normalizeNumber(addedHours);
      }
      if (estimatedGallons !== undefined) {
        updatePayload.estimatedGallons = normalizeNumber(estimatedGallons);
      }
      if (upsellValue !== undefined) {
        updatePayload.upsellValue = String(upsellValue);
      }

      const designConsultation = await DesignConsultation.findByIdAndUpdate(
        id,
        updatePayload,
        { new: true }
      );

      if (req.file?.fileUrl) {
        await Contract.findOneAndUpdate(
          { designConsultationId: existingDesignConsultation._id },
          {
            createdBy: user.userId,
            clientId: job.clientId,
            contractUrl: req.file.fileUrl,
            jobId: job._id,
            designConsultationId: existingDesignConsultation._id,
          },
          { new: true, upsert: true }
        );
      }

      res.status(200).json({
        success: true,
        data: designConsultation,
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
