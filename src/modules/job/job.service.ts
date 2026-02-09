import { Types } from "mongoose";
import { DesignConsultation } from "./design-consultation.model";
import { JobRepository } from "./job.repository";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { QuoteRepository } from "../quote/quote.repository";
import { logger } from "../../utils/logger";
import { ClientRepository } from "../client/client.repository";
import {
  createNotification,
  createNotificationsForRole,
} from "../../utils/create-notification-utils";

export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private salesRepRepo: SalesRepRepository,
    private quoteRepo: QuoteRepository,
    private clientRepo: ClientRepository
  ) { }

  private normalizeObjectId = (value: any) => {
    if (!value) {
      return null;
    }
    if (typeof value === "string") {
      return value;
    }
    if (value instanceof Types.ObjectId) {
      return value.toString();
    }
    if (value._id) {
      return value._id.toString();
    }
    return value.toString();
  };

  private applyDesignConsultationAdjustments = (job: any) => {
    if (!job) {
      return job;
    }
    const base = job.toObject ? job.toObject() : { ...job };
    const dc = Array.isArray(base.designConsultation)
      ? base.designConsultation[0]
      : base.designConsultation;
    const addedHours = Number(dc?.addedHours || 0);
    const estimatedGallons = Number(dc?.estimatedGallons || 0);
    const upsellValue = Number(dc?.upsellValue || 0);
    const totalHours = Number(base.totalHours || 0) + addedHours;
    const totalEstimatedGallons =
      Number(base.estimatedGallons || 0) + estimatedGallons;
    const totalPrice = Number(base.price || 0) + upsellValue;
    const laborHours =
      totalHours -
      Number(base.powerwash || 0) -
      Number(base.setupCleanup || 0);

    return {
      ...base,
      totalHours,
      estimatedGallons: totalEstimatedGallons,
      price: totalPrice,
      laborHours,
    };
  };

  createJob = async (jobInfo: any, contractUrl: string | undefined, user: any) => {
    const salesRep = await this.salesRepRepo.findByUserId(user.userId);
    if (!salesRep) {
      throw new Error("Sales rep not found");
    }
    if (jobInfo.quoteId) {
      const quote = await this.quoteRepo.updateQuoteStatus(
        jobInfo.quoteId,
        "Approved"
      );

      if (quote?.clientId) {
        await this.clientRepo.updateLeadStatus(
          quote.clientId.toString(),
          "Job"
        );
      }

    }
    const job = {
      ...jobInfo,
      ...(contractUrl ? { contractUrl } : {}),
      salesRepId: user.userId
    };
    const newJob = await this.jobRepository.createJob(job);
    await this.salesRepRepo.incrementSalesRepStats("job", user.userId);
    await createNotificationsForRole("Admin", {
      type: "quote_converted_job",
      message: "A quote was converted into a job",
    });
    return newJob;
  };

  createJobNote = async (jobNote: any, user: any) => {
    const jobNoteData = {
      clientId: jobNote.clientId,
      quoteId: jobNote.quoteId,
      jobId: jobNote.jobId,
      note: jobNote.note,
      file: jobNote.file,
      createdBy: user.userId,
    };
    const newNote = await this.jobRepository.createJobNote(jobNoteData);
    await createNotificationsForRole("Admin", {
      type: "note_added",
      message: "A note was added to a job",
    });
    if (jobNoteData.jobId) {
      const job = await this.jobRepository.getJobById(jobNoteData.jobId);
      const productionManagerId = this.normalizeObjectId(
        job?.productionManagerId
      );
      if (productionManagerId) {
        await createNotification({
          forUser: productionManagerId,
          type: "note_added",
          message: "A note was added to one of your jobs",
        });
      }
    }
    return newNote;
  };

  createNewDesignConsultation = async (designConsultationInfo: any) => {
    const newDesignConsultation = new DesignConsultation(
      designConsultationInfo
    );
    return await newDesignConsultation.save();
  };

  getAllJobs = async (query: any) => {
    const result = await this.jobRepository.getAllJobs(query);
    return {
      ...result,
      jobs: result.jobs.map(this.applyDesignConsultationAdjustments),
    };
  };

  getJobById = async (id: string) => {
    const job = await this.jobRepository.getJobById(id);
    return this.applyDesignConsultationAdjustments(job);
  };

  getAllDesignConsultation = async (query: any) => {
    return await this.jobRepository.getAllDesignConsultation(query);
  };

  getDesignConsultationById = async (id: string) => {
    return await DesignConsultation.findById(id);
  };

  getAllDownpaymentRequest = async (query: any) => {
    return await this.jobRepository.getAllDownpaymentRequest(query);
  };

  getAllJobCloseApproval = async (query: any) => {
    return await this.jobRepository.getAllJobCloseApproval(query);
  };

  getAllJobBySalesRepId = async (id: string, query: any) => {
    return await this.jobRepository.getAllJobBySalesRepId(id, query);
  };

  getAllPaymentBySalesRepId = async (id: string, query: any) => {
    return await this.jobRepository.getAllPaymentBySalesRepId(id, query);
  };

  updateJobById = async (id: string, jobInfo: any, user: any) => {
    const job = await this.jobRepository.getJobById(id);
    if (!job) {
      throw new Error("Job not found");
    }
    if (
      jobInfo?.downPaymentStatus === "Approved" &&
      job?.dcStatus === "Approved" &&
      jobInfo?.status !== "Ready to Schedule"
    ) {
      jobInfo = {
        ...jobInfo,
        status: "Ready to Schedule",
      };
    }
    const resolveStatus = (
      nextDcStatus: string | undefined,
      nextDownPaymentStatus: string | undefined
    ) => {
      if (nextDcStatus !== "Approved") {
        return "DC Pending";
      }
      if (nextDownPaymentStatus !== "Approved") {
        return "Downpayment Pending";
      }
      return "Ready to Schedule";
    };
    const syncDesignConsultationStatus = async () => {
      if (jobInfo?.dcStatus === "Approved") {
        await DesignConsultation.findOneAndUpdate(
          { jobId: id },
          { status: "Approved" }
        );
        const nextStatus = resolveStatus(
          "Approved",
          job.downPaymentStatus
        );
        await this.jobRepository.updateJobById(id, { status: nextStatus });
      }
    };
    const previousProductionManagerId = this.normalizeObjectId(
      job.productionManagerId
    );
    const nextProductionManagerId = this.normalizeObjectId(
      jobInfo?.productionManagerId
    );
    let notifiedProductionManagerChange = false;
    if (nextProductionManagerId && nextProductionManagerId !== previousProductionManagerId) {
      if (previousProductionManagerId) {
        await createNotification({
          forUser: previousProductionManagerId,
          type: "job_unassigned",
          message: "You have been unassigned from a job",
        });
      }
      await createNotification({
        forUser: nextProductionManagerId,
        type: "job_assigned",
        message: "A new job has been assigned to you",
      });
      notifiedProductionManagerChange = true;
    }
    const status = jobInfo?.status;
    if (status === "Scheduled and Open") {
      if (!jobInfo?.productionManagerId) {
        throw new Error("Production manager is required");
      }
      const updatedJob = await this.jobRepository.updateJobById(id, jobInfo);
      await createNotificationsForRole("Admin", {
        type: "job_status_scheduled_open",
        message: "A job was marked as Scheduled and Open",
      });
      if (!notifiedProductionManagerChange) {
        const productionManagerId = this.normalizeObjectId(
          jobInfo.productionManagerId
        );
        await createNotification({
          forUser: productionManagerId,
          type: "job_assigned",
          message: "A new job has been assigned to you",
        });
      }
      await syncDesignConsultationStatus();
      return updatedJob;
    }
    if (status === "Ready to Schedule") {
      const updatedJob = await this.jobRepository.updateJobById(id, jobInfo);
      await createNotificationsForRole("Production Manager", {
        type: "job_status_ready_to_schedule",
        message: "A job is ready to schedule",
      });
      await syncDesignConsultationStatus();
      return updatedJob;
    }
    if (status === "Pending Close") {
      const updatedJob = await this.jobRepository.updateJobById(id, jobInfo);
      await createNotificationsForRole("Admin", {
        type: "job_status_pending_close",
        message: "A job was marked as Pending Close",
      });
      await syncDesignConsultationStatus();
      return updatedJob;
    }
    if (status === "Closed" && job) {
      const updatedJob = await this.jobRepository.updateJobById(id, jobInfo);
      const salesRepUserId = this.normalizeObjectId(job.salesRepId);
      if (salesRepUserId) {
        await this.salesRepRepo.updateCommissionEarned(
          salesRepUserId as any,
          job.price
        );
      }
      const productionManagerId = this.normalizeObjectId(
        job.productionManagerId
      );
      if (productionManagerId) {
        await createNotification({
          forUser: productionManagerId,
          type: "job_status_closed",
          message: "A job assigned to you was marked as Closed",
        });
      }
      await syncDesignConsultationStatus();
      return updatedJob;
    }

    const updatedJob = await this.jobRepository.updateJobById(id, jobInfo);
    await syncDesignConsultationStatus();
    return updatedJob;
  };
  
  assignSalesRep = async (jobId: string, salesRepId: string) => {
    return await this.jobRepository.assignSalesRep(jobId, salesRepId)
  }

  updateDownpaymentStatus = async (id: string, status: string) => {
    const existingJob = await this.jobRepository.getJobById(id);
    const updatedJob = await this.jobRepository.updateDownpaymentStatus(
      id,
      status
    );
    const resolveStatus = (
      nextDcStatus: string | undefined,
      nextDownPaymentStatus: string | undefined
    ) => {
      if (nextDcStatus !== "Approved") {
        return "DC Pending";
      }
      if (nextDownPaymentStatus !== "Approved") {
        return "Downpayment Pending";
      }
      return "Ready to Schedule";
    };
    const nextStatus = resolveStatus(existingJob?.dcStatus, status);
    if (existingJob && existingJob.status !== nextStatus) {
      await this.jobRepository.updateJobById(id, { status: nextStatus });
      if (nextStatus === "Ready to Schedule") {
        await createNotificationsForRole("Production Manager", {
          type: "job_status_ready_to_schedule",
          message: "A job is ready to schedule",
        });
      }
    }
    if (
      status === "Approved" &&
      existingJob?.downPaymentStatus !== "Approved" &&
      existingJob?.salesRepId
    ) {
      await createNotification({
        forUser: existingJob.salesRepId.toString(),
        type: "downpayment_approved",
        message: "Your downpayment request has been approved",
      });
    }
    return updatedJob;
  };

  deleteJobById = async (id: string) => {
    return await this.jobRepository.deleteJobById(id);
  };
}
