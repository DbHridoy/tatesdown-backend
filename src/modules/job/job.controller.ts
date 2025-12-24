import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { JobService } from "./job.service";
import { HttpCodes } from "../../constants/status-codes";
import mongoose from "mongoose";

export class JobController {
  constructor(private readonly jobService: JobService) {}

createNewJob = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jobInfo: any = { ...req.body };

    // Parse notes JSON string to array
    if (jobInfo.notes && typeof jobInfo.notes === "string") {
      try {
        jobInfo.notes = JSON.parse(jobInfo.notes);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid notes JSON",
        });
      }
    }

    // Parse designConsultation JSON string to array
    if (jobInfo.designConsultation && typeof jobInfo.designConsultation === "string") {
      try {
        jobInfo.designConsultation = JSON.parse(jobInfo.designConsultation);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid designConsultation JSON",
        });
      }
    }

    // Attach uploaded file to first designConsultation object
    if (req.file?.fileUrl && jobInfo.designConsultation?.length) {
      jobInfo.designConsultation[0].file = req.file.fileUrl;
    }

    // Convert numbers/dates if needed
    jobInfo.estimatedPrice = Number(jobInfo.estimatedPrice);
    jobInfo.downPayment = Number(jobInfo.downPayment);
    jobInfo.startDate = new Date(jobInfo.startDate);

    jobInfo.designConsultation?.forEach((dc: any) => {
      if (dc.estimatedStartDate) dc.estimatedStartDate = new Date(dc.estimatedStartDate);
      if (dc.addedHours) dc.addedHours = Number(dc.addedHours);
    });

    const job = await this.jobService.createNewJob(jobInfo);

    res.status(200).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  }
);

addJobNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  let { note, createdBy } = req.body;

  if (!note || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Both note and createdBy are required",
    });
  }

  // Convert ObjectId if needed
  const noteObj = {
    note,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  };

  const updatedJob = await this.jobService.addJobNote(jobId, noteObj);

  res.status(200).json({
    success: true,
    message: "Note added successfully",
    data: updatedJob,
  });
});
updateJob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  const updateData: any = { ...req.body };

  // Parse notes and designConsultation if they are JSON strings
  if (updateData.notes && typeof updateData.notes === "string") {
    try {
      updateData.notes = JSON.parse(updateData.notes);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid notes JSON" });
    }
  }

  if (updateData.designConsultation && typeof updateData.designConsultation === "string") {
    try {
      updateData.designConsultation = JSON.parse(updateData.designConsultation);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid designConsultation JSON" });
    }
  }

  // Attach uploaded file to the first design consultation object (if any)
  if (req.file?.fileUrl && updateData.designConsultation?.length) {
    updateData.designConsultation[0].file = req.file.fileUrl;
  }

  // Convert numbers/dates
  if (updateData.estimatedPrice) updateData.estimatedPrice = Number(updateData.estimatedPrice);
  if (updateData.downPayment) updateData.downPayment = Number(updateData.downPayment);
  if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);

  if (updateData.designConsultation?.length) {
    updateData.designConsultation.forEach((dc: any) => {
      if (dc.estimatedStartDate) dc.estimatedStartDate = new Date(dc.estimatedStartDate);
      if (dc.addedHours) dc.addedHours = Number(dc.addedHours);
    });
  }

  const updatedJob = await this.jobService.updateJob(jobId, updateData);

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: updatedJob,
  });
});

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

  // createJobNote = asyncHandler(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const jobNote = req.body;
  //     const job = await this.jobService.createJobNote(jobNote);
  //     res.status(HttpCodes.Ok).json({
  //       success: true,
  //       message: "Job note created successfully",
  //       data: job,
  //     });
  //   }
  // );
 
  getAllJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const job = await this.jobService.getAllJobs();
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Job fetched successfully",
        data: job,
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
}
