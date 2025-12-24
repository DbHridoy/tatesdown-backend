import { Types } from "mongoose";
import { jobNote, newJobs, updateJobs } from "./job.interface";
import { JobRepository } from "./job.repository";

export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  createNewJob = async (jobInfo: newJobs) => {
    return await this.jobRepository.createNewJob(jobInfo);
  };
addJobNote = async (jobId: string, noteObj: { note: string; createdBy: Types.ObjectId }) => {
  return await this.jobRepository.addJobNote(jobId, noteObj);
};

  updateJobById = async (id: string, jobInfo: updateJobs) => {
    return await this.jobRepository.updateJobById(id, jobInfo);
  };
  updateJob = async (jobId: string, updateData: any) => {
  return await this.jobRepository.updateJob(jobId, updateData);
};


  deleteJobById = async (id: string) => {
    return await this.jobRepository.deleteJobById(id);
  };
  // createJobNote = async (jobNote: jobNote) => {
  //   return await this.jobRepository.createJobNote(jobNote);
  // };
  getAllJobs = async () => {
    return await this.jobRepository.getAllJobs();
  };
  getJobById = async (id: string) => {
    return await this.jobRepository.getJobById(id);
  };
}
