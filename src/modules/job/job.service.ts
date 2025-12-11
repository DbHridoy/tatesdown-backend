import { jobNote, newJobs, updateJobs } from "./job.interface";
import { JobRepository } from "./job.repository";

export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  createNewJob = async (jobInfo: newJobs) => {
    return await this.jobRepository.createNewJob(jobInfo);
  };

  updateJobById = async (id: string, jobInfo: updateJobs) => {
    return await this.jobRepository.updateJobById(id, jobInfo);
  };

  deleteJobById = async (id: string) => {
    return await this.jobRepository.deleteJobById(id);
  };
  createJobNote = async (jobNote: jobNote) => {
    return await this.jobRepository.createJobNote(jobNote);
  };
  getAllJobs = async () => {
    return await this.jobRepository.getAllJobs();
  };
  getJobById = async (id: string) => {
    return await this.jobRepository.getJobById(id);
  };
}
