import JobNote from "./job-note.model";
import { Job } from "./job.model";
import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
import { logger } from "../../utils/logger";
import DesignConsultation from "./design-consultation.model";

export class JobRepository {
  createNewJob = async (jobInfo: any) => {
    logger.info({ jobInfo }, "JobRepository.createNewJob");
    const newJob = new Job(jobInfo);
    return await newJob.save();
  };

  updateJobById = async (id: string, jobInfo: any) => {
    const updatedJob = await Job.findByIdAndUpdate(id, jobInfo, { new: true });
    return updatedJob;
  };

  deleteJobById = async (id: string) => {
    const deletedJob = await Job.findByIdAndDelete(id);
    return deletedJob;
  };

  createJobNote = async (jobNote: any) => {
    const newJobNote = new JobNote(jobNote);
    return newJobNote.save();
  };

  getAllJobs = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Job, query);
    const [jobs, total] = await Promise.all([
      Job.find({ ...filter, ...search }, null, options)
        .populate({
          path: "quoteId",
          populate: {
            path: "clientId",
            populate: {
              path: "salesRepId",
            },
          },
        })
        .populate({
          path: "notes",
          populate: {
            path: "authorId",
          },
        })
        .populate("designConsultaion"),
      Job.countDocuments({ ...filter, ...search }),
    ]);
    return { jobs, total };
  };

  getJobById = async (id: string) => {
    return await Job.findById(id)
      .populate({
        path: "quoteId",
        populate: {
          path: "clientId",
          populate: {
            path: "salesRepId",
          },
        },
      })
      .populate({
        path: "notes",
        populate: {
          path: "authorId",
        },
      })
      .populate("designConsultaion");
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
    const { filter, search, options } = buildDynamicSearch(Job, query);

    // merge filters correctly
    const finalFilter = {
      ...filter,
      ...search,
      downPaymentStatus: "Pending",
    };

    const [downpaymentRequest, total] = await Promise.all([
      Job.find(finalFilter, null, options).populate({
        path: "quoteId",
        populate: {
          path: "clientId",
        },
      }),
      Job.countDocuments(finalFilter),
    ]);

    return { downpaymentRequest, total };
  };

  getAllJobCloseApproval = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Job, query);

    // merge filters correctly
    const finalFilter = {
      ...filter,
      ...search,
      status: "Pending Close",
    };

    const [jobs, total] = await Promise.all([
      Job.find(finalFilter, null, options).populate({
        path: "quoteId",
        populate: {
          path: "clientId",
        },
      }),
      Job.countDocuments(finalFilter),
    ]);

    return { jobs, total };
  };

  updateDownpaymentStatus = async (id: string, status: string) => {
    return await Job.findByIdAndUpdate(
      id,
      { downPaymentStatus: status },
      { new: true }
    );
  };
}
