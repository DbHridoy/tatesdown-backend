import { Types } from "mongoose";
import { DesignConsultation } from "./design-consultation.model";
import { JobRepository } from "./job.repository";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { QuoteRepository } from "../quote/quote.repository";
import { logger } from "../../utils/logger";
import { ClientRepository } from "../client/client.repository";

export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private salesRepRepo: SalesRepRepository,
    private quoteRepo: QuoteRepository,
    private clientRepo: ClientRepository
  ) { }

  createNewJob = async (jobInfo: any, user: any) => {
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
        logger.info(
          { clientId: quote.clientId },
          "Client leadStatus updated to Job"
        );
      }

      logger.info({ quoteId: jobInfo.quoteId }, "Quote marked as Approved");
    }
    const job = {
      ...jobInfo,
      salesRepId: salesRep._id,
    };
    const newJob = await this.jobRepository.createNewJob(job);
    await this.salesRepRepo.incrementSalesRepStats("job", salesRep._id);
    return newJob;
  };

  createJobNote = async (jobNote: any, user: any) => {
    const jobNoteData = {
      jobId: jobNote.jobId,
      note: jobNote.note,
      file: jobNote.file,
      clientId: jobNote.clientId,
      createdBy: user.userId,
    };
    return await this.jobRepository.createJobNote(jobNoteData);
  };
  createNewDesignConsultation = async (designConsultationInfo: any) => {
    const newDesignConsultation = new DesignConsultation(
      designConsultationInfo
    );
    return await newDesignConsultation.save();
  };

  getAllJobs = async (query: any) => {
    return await this.jobRepository.getAllJobs(query);
  };

  getJobById = async (id: string) => {
    return await this.jobRepository.getJobById(id);
  };

  getAllDesignConsultation = async () => {
    return await DesignConsultation.find();
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
    const status = jobInfo?.status;
    if (status === "Scheduled") {
      if(!jobInfo.productionManagerId){
        throw new Error("Production manager is required");
      }
      await this.jobRepository.updateJobById(id, jobInfo);
      // TODO: Send notification to client and sales rep
      return jobInfo;
    }
    if (status === "Closed" && job) {
      await this.salesRepRepo.updateCommissionEarned(job.salesRepId, job.price);
      // TODO: Send notification to client and sales rep
      return await this.jobRepository.getJobById(id);
    }

  };
  assignSalesRep = async (jobId: string, salesRepId: string) => {
    return await this.jobRepository.assignSalesRep(jobId, salesRepId)
  }

  updateDownpaymentStatus = async (id: string, status: string) => {
    return await this.jobRepository.updateDownpaymentStatus(id, status);
  };

  deleteJobById = async (id: string) => {
    return await this.jobRepository.deleteJobById(id);
  };
}
