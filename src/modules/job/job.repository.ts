import { jobNote, newJobs, updateJobs } from "./job.interface";
import { IDesignConsultation, Job } from "./job.model";

export class JobRepository {
  createNewJob = async (jobInfo: newJobs) => {
    const newJob = new Job(jobInfo);
    return await newJob.save();
  };

  updateJobById = async (id: string, jobInfo: updateJobs) => {
    const updatedJob = await Job.findByIdAndUpdate(id, jobInfo, { new: true });
    return updatedJob;
  };
  updateJob = async (jobId: string, updateData: any) => {
    const updateQuery: any = {};

    // Handle notes: append new ones
    if (updateData.notes?.length) {
      updateQuery.$push = { notes: { $each: updateData.notes } };
      delete updateData.notes;
    }

    // Handle designConsultation: replace the array (1 DC per job)
    if (updateData.designConsultation?.length) {
      updateQuery.$set = {
        ...updateQuery.$set,
        designConsultation: updateData.designConsultation,
      };
      delete updateData.designConsultation;
    }

    // Set other fields
    if (Object.keys(updateData).length) {
      updateQuery.$set = { ...updateQuery.$set, ...updateData };
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) throw new Error("Job not found");

    return updatedJob;
  };

  addJobNote = async (jobId: string, noteObj: any) => {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $push: { notes: noteObj } },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      throw new Error("Job not found");
    }

    return updatedJob;
  };

  createJobNote = async (jobId: string, jobNote: jobNote) => {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $push: { notes: jobNote } },
      { new: true }
    );
    return updatedJob;
  };

  createJobDesignConsultation = async (
    jobId: string,
    jobDesignConsultation: IDesignConsultation
  ) => {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $push: { designConsultation: jobDesignConsultation } },
      { new: true }
    );
    return updatedJob;
  };

  deleteJobById = async (id: string) => {
    const deletedJob = await Job.findByIdAndDelete(id);
    return deletedJob;
  };

  getAllJobs = async () => {
    return await Job.find();
  };

  getJobById = async (id: string) => {
    return await Job.findById(id);
  };
}
