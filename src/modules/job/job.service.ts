import DesignConsultation from "./design-consultation.model";
import { JobRepository } from "./job.repository";

export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  createNewJob = async (jobInfo: any) => {
    return await this.jobRepository.createNewJob(jobInfo);
  };

  updateJobById = async (id: string, jobInfo: any) => {
    return await this.jobRepository.updateJobById(id, jobInfo);
  };

  deleteJobById = async (id: string) => {
    return await this.jobRepository.deleteJobById(id);
  };

  createJobNote = async (jobNote: any) => {
    return await this.jobRepository.createJobNote(jobNote);
  };

  getAllJobs = async (query: any) => {
    return await this.jobRepository.getAllJobs(query);
  };

  getJobById = async (id: string) => {
    return await this.jobRepository.getJobById(id);
  };

  createNewDesignConsultation = async (designConsultationInfo: any) => {
    const newDesignConsultation = new DesignConsultation(
      designConsultationInfo
    );
    return await newDesignConsultation.save();
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
  getAllJobBySalesRepId=async(id:string,query:any)=>{
    return await this.jobRepository.getAllJobBySalesRepId(id,query)
  }
  getAllPaymentBySalesRepId=async(id:string,query:any)=>{
    return await this.jobRepository.getAllPaymentBySalesRepId(id,query)
  }

  updateDownpaymentStatus = async (id: string, status: string) => {
    return await this.jobRepository.updateDownpaymentStatus(id, status);
  };
}
