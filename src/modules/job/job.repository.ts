import JobNote from "./job-note.model";
import { Job } from "./job.model";
import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
import { logger } from "../../utils/logger";
import { DesignConsultation } from "./design-consultation.model";
import { Types } from "mongoose";
import Payment from "./payment.model";

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

  assignSalesRep = async (jobId: string, salesRepId: string) => {
    return await Job.findByIdAndUpdate(
      jobId,
      { salesRepId: salesRepId },
      { new: true }
    );
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
        .populate("clientId salesRepId quoteId")
        .populate({
          path: "notes",
          populate: {
            path: "authorId",
          },
        })
        .populate("designConsultation"),
      Job.countDocuments({ ...filter, ...search }),
    ]);
    return { jobs, total };
  };

  getJobById = async (id: string) => {
    return await Job.findById(id)
      .populate("clientId salesRepId quoteId")
      .populate({
        path: "notes",
        populate: {
          path: "authorId",
        },
      })
      .populate("designConsultation");
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
  getAllJobBySalesRepId = async (salesRepId: string, query: any) => {
    const { filter, search, options } = buildDynamicSearch(Job, query);

    const matchStage = {
      ...filter,
      ...search,
      "client.salesRepId": new Types.ObjectId(salesRepId),
    };

    const pipeline = [
      // 🔹 Join Quote
      {
        $lookup: {
          from: "quotes", // ⚠️ collection name (plural!)
          localField: "quoteId",
          foreignField: "_id",
          as: "quote",
        },
      },
      { $unwind: "$quote" },

      // 🔹 Join Client
      {
        $lookup: {
          from: "clients", // ⚠️ collection name (plural!)
          localField: "quote.clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },

      // 🔹 Apply ALL filters here
      {
        $match: matchStage,
      },

      // 🔹 Branch pipeline
      {
        $facet: {
          jobs: [
            { $sort: options.sort },
            { $skip: options.skip },
            { $limit: options?.limit || 10 },
          ],

          totalCount: [{ $count: "total" }],

          totalEstimatedPrice: [
            {
              $group: {
                _id: null,
                sum: { $sum: "$estimatedPrice" },
              },
            },
          ],
        },
      },
    ];

    const [result] = await Job.aggregate(pipeline);

    return {
      jobs: result.jobs,
      total: result.totalCount[0]?.total || 0,
      totalEstimatedPrice: result.totalEstimatedPrice[0]?.sum || 0,
    };
  };

  updateDownpaymentStatus = async (id: string, status: string) => {
    return await Job.findByIdAndUpdate(
      id,
      { downPaymentStatus: status },
      { new: true }
    );
  };
  getAllPaymentBySalesRepId = async (id: string, query: any) => {
    const { filter, search, options } = buildDynamicSearch(Payment, query);
    const matchStage = {
      ...filter,
      ...search,
      salesRepId: new Types.ObjectId(id),
    };
    const payment = await Payment.find(matchStage, null, options);
    const total = await Payment.countDocuments(matchStage);
    return { payment, total };
  };
}
