import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
import Counter from "./counter.model";
import { Notification } from "./notification.model";
import { Variable } from "./variable.model";
import { Cluster } from "./cluster.model";
import Mileage from "../expense/mileage.model";
import { Types } from "mongoose";
import { Client } from "../client/client.model";
import { Quote } from "../quote/quote.model";
import { Job } from "../job/job.model";
import { Overview } from "./overview.model";
import { logger } from "../../utils/logger";

const getCalendarPeriodRange = (date: Date, periodType: string) => {
  const base = new Date(date);
  if (Number.isNaN(base.getTime())) {
    throw new Error("Invalid date");
  }

  let start: Date;
  let end: Date;

  switch (periodType) {
    case "day": {
      start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
      end = new Date(start);
      end.setDate(end.getDate() + 1);
      break;
    }
    case "week": {
      const dayOfWeek = base.getDay();
      start = new Date(base.getFullYear(), base.getMonth(), base.getDate() - dayOfWeek);
      end = new Date(start);
      end.setDate(end.getDate() + 7);
      break;
    }
    case "month": {
      start = new Date(base.getFullYear(), base.getMonth(), 1);
      end = new Date(base.getFullYear(), base.getMonth() + 1, 1);
      break;
    }
    case "year": {
      start = new Date(base.getFullYear(), 0, 1);
      end = new Date(base.getFullYear() + 1, 0, 1);
      break;
    }
    default:
      throw new Error("Invalid period type");
  }

  return { start, end };
};

export class CommonRepository {
  generateSequentialId = async (prefix: string, counterName: string) => {
    const counter = await Counter.findOneAndUpdate(
      { name: counterName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    return `${prefix}${counter.seq}`;
  };

  createCluster = async (clusterName: string) => {
    const cluster = await Cluster.create({ clusterName });
    return cluster;
  };

  upsertVariable = async (variables: any) => {
    console.log(variables);
    return Variable.findOneAndUpdate(
      { singletonKey: "VARIABLE_CONFIG" },
      variables,
      {
        upsert: true, // create if missing
        new: true, // return updated doc
      }
    );
  };

  getCluster = async () => {
    return Cluster.find();
  };

  getVariable = async () => {
    return Variable.findOne();
  };

  getNotification = async (query: {}) => {
    const { filter, search, options } = buildDynamicSearch(Notification, query);
    const notifications = await Notification.find(
      { ...filter, ...search },
      null,
      options
    );
    return notifications;
  };

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

  getSalesRepPeriodStats = async (
    userId: string,
    periodType: string,
    date: Date
  ) => {
    const { start, end } = getCalendarPeriodRange(date, periodType);

    logger.info({ start, end }, "CommonRepository.getSalesRepPeriodStats line 159");
    const salesRepObjectId = new Types.ObjectId(userId);

    const [
      totalClients,
      totalQuotes,
      totalJobs,
      totalSoldAgg,
      commissionPendingAgg,
      commissionEarnedAgg,
      revenueEarnedAgg,
      revenueProducedAgg,
    ] = await Promise.all([
      Client.countDocuments({
        salesRepId: salesRepObjectId,
        createdAt: { $gte: start, $lt: end },
      }),
      Quote.countDocuments({
        salesRepId: salesRepObjectId,
        createdAt: { $gte: start, $lt: end },
      }),
      Job.countDocuments({
        salesRepId: salesRepObjectId,
        createdAt: { $gte: start, $lt: end },
      }),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: { $ne: "Cancelled" },
            createdAt: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: { $in: ["Scheduled and Open", "Pending Close"] },
            startDate: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: "Closed",
            updatedAt: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: { $in: ["Scheduled and Open", "Pending Close"] },
            startDate: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: "Closed",
            updatedAt: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
    ]);

    return {
      totalSold: totalSoldAgg[0]?.total || 0,
      totalClients,
      totalQuotes,
      totalJobs,
      totalCommissionPending: commissionPendingAgg[0]?.total || 0,
      totalCommissionEarned: commissionEarnedAgg[0]?.total || 0,
      totalRevenueEarned: revenueEarnedAgg[0]?.total || 0,
      totalRevenueProduced: revenueProducedAgg[0]?.total || 0,
    };
  };
  



  incrementOverview = async ({
    fiscalYearId,
    periodType,
    periodIndex,
    periodStart,
    inc,
  }: any) => {
    logger.info({ fiscalYearId, periodType, periodIndex, periodStart, inc }, "CommonRepository.incrementOverview"); 
    return Overview.updateOne(
      { fiscalYearId, periodType, periodIndex },
      {
        $setOnInsert: {
          fiscalYearId,
          periodType,
          periodIndex,
          periodStart,
        },
        $inc: inc,
      },
      { upsert: true }
    );
  };

  findByPeriod = (query: any) => Overview.find(query).sort({ periodIndex: 1 });
}
