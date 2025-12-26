import JobNote from "./job-note.model";
import { jobNote, newJobs, updateJobs } from "./job.interface";
import { Job } from "./job.model";

export class JobRepository {
  createNewJob = async (jobInfo: newJobs) => {
    const newJob = new Job(jobInfo);
    return await newJob.save();
  };

  updateJobById = async (id: string, jobInfo: updateJobs) => {
    const updatedJob = await Job.findByIdAndUpdate(id, jobInfo, { new: true });
    return updatedJob;
  };

  deleteJobById = async (id: string) => {
    const deletedJob = await Job.findByIdAndDelete(id);
    return deletedJob;
  };

  createJobNote = async (jobNote: jobNote) => {
    const newJobNote = new JobNote(jobNote);
    return newJobNote.save();
  };

  getAllJobs = async () => {
    const [jobs, total] = await Promise.all([
      Job.find(),
      Job.countDocuments(),
    ]);
    return { jobs, total };
  };

  getJobById = async (id: string) => {
    return await Job.findById(id)
  };
}
