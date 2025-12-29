import { Types } from "mongoose";
import { Client } from "../client/client.model";
import Mileage from "../expense/mileage.model";
import { Job } from "../job/job.model";
import { Quote } from "../quote/quote.model";

export class StatsRepository {
  constructor() {}
  getAdminStats = async () => {
    const totalLeads = await Client.countDocuments();

    // Aggregate the total number of quotes
    const totalQuotes = await Quote.countDocuments();

    // Aggregate the booked jobs
    const bookedJobs = await Job.countDocuments({ status: "Booked" });

    // Aggregate the ready to schedule jobs (assuming 'Scheduled' status means ready to schedule)
    const readyToScheduleJobs = await Job.countDocuments({
      status: "Scheduled",
    });

    // Aggregate scheduled and open jobs (Scheduled but not approved down payment)
    const scheduledAndOpenJobs = await Job.countDocuments({
      status: "Scheduled",
      downPaymentStatus: { $ne: "Approved" },
    });

    // Aggregate closed jobs
    const closedJobs = await Job.countDocuments({ status: "Closed" });

    // Aggregate total estimated amount of closed jobs
    const totalEstimatedAmountOfClosedJobs = await Job.aggregate([
      { $match: { status: "Closed" } },
      { $group: { _id: null, total: { $sum: "$estimatedPrice" } } },
    ]);

    // Prepare stats object
    const stats = {
      totalLeads,
      totalQuotes,
      bookedJobs,
      readyToScheduleJobs,
      scheduledAndOpenJobs,
      closedJobs,
      totalEstimatedAmountOfClosedJobs:
        totalEstimatedAmountOfClosedJobs[0]?.total || 0,
    };
    return stats;
  };

  getSalesRepStats = async (salesRepId: string) => {
    const totalDeduction = await Mileage.aggregate([
      { $match: { salesRepId: new Types.ObjectId(salesRepId) } },
      { $group: { _id: null, totalDeduction: { $sum: "$deduction" } } },
    ]).then((res) => res[0]?.totalDeduction || 0);

    return totalDeduction;
  };
}
