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
    const [
      totalClients,
      totalQuotes,
      totalJobs,
      readyToScheduleCount,
      scheduledAndOpenCount,
      pendingCloseCount,
      closedCount,
      cancelledCount,
      readyToScheduleAgg,
      scheduledAndOpenAgg,
      pendingCloseAgg,
      closedAgg,
      totalRevenueAgg,
    ] = await Promise.all([
      Client.countDocuments(),
      Quote.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ status: "Ready to Schedule" }),
      Job.countDocuments({ status: "Scheduled and Open" }),
      Job.countDocuments({ status: "Pending Close" }),
      Job.countDocuments({ status: "Closed" }),
      Job.countDocuments({ status: "Cancelled" }),
      Job.aggregate([
        { $match: { status: "Ready to Schedule" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: "Scheduled and Open" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: "Pending Close" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: "Closed" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
    ]);

    return {
      totalClients,
      totalQuotes,
      totalJobs,
      readyToScheduleCount,
      scheduledAndOpenCount,
      pendingCloseCount,
      closedCount,
      cancelledCount,
      totalRevenueEarned: readyToScheduleAgg[0]?.total || 0,
      totalRevenuePending:
        (scheduledAndOpenAgg[0]?.total || 0) +
        (pendingCloseAgg[0]?.total || 0),
      totalRevenueProduced: closedAgg[0]?.total || 0,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
    };
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

  getSalesRepPersonalStats = async (userId: string) => {
    const salesRepObjectId = new Types.ObjectId(userId);
    const [
      totalClients,
      totalQuotes,
      totalJobs,
      readyToScheduleAgg,
      closedAgg,
      nonCancelledAgg,
      pendingAgg,
      variable,
    ] = await Promise.all([
      Client.countDocuments({ salesRepId: salesRepObjectId }),
      Quote.countDocuments({ salesRepId: salesRepObjectId }),
      Job.countDocuments({ salesRepId: salesRepObjectId }),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: "Ready to Schedule",
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: "Closed",
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: { $ne: "Cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: { $in: ["Ready to Schedule", "Scheduled and Open", "Pending Close"] },
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Variable.findOne().select("salesRepCommissionRate"),
    ]);

    const commissionRate = Number(variable?.salesRepCommissionRate || 0);
    const totalRevenueEarned = readyToScheduleAgg[0]?.total || 0;
    const totalRevenueProduced = closedAgg[0]?.total || 0;
    const totalCommissionEarned = (nonCancelledAgg[0]?.total || 0) * commissionRate;
    const totalCommissionPaid = totalRevenueProduced * commissionRate;
    const totalCommissionPending = (pendingAgg[0]?.total || 0) * commissionRate;

    return {
      totalClients,
      totalQuotes,
      totalJobs,
      totalRevenueEarned,
      totalRevenueProduced,
      totalCommissionEarned,
      totalCommissionPaid,
      totalCommissionPending,
    };
  };

  getProductionManagerJobStats = async (productionManagerUserId: string) => {
    const productionManagerObjectId = new Types.ObjectId(
      productionManagerUserId
    );
    const [result] = await Job.aggregate([
      {
        $facet: {
          readyToScheduleCount: [
            { $match: { status: "Ready to Schedule" } },
            { $count: "count" },
          ],
          scheduledAndOpenCount: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Scheduled and Open",
              },
            },
            { $count: "count" },
          ],
          pendingCloseCount: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Pending Close",
              },
            },
            { $count: "count" },
          ],
          cancelledCount: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Cancelled",
              },
            },
            { $count: "count" },
          ],
          totalRevenue: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Scheduled and Open",
              },
            },
            { $group: { _id: null, total: { $sum: "$price" } } },
          ],
          totalProducedRevenue: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Closed",
              },
            },
            { $group: { _id: null, total: { $sum: "$price" } } },
          ],
        },
      },
    ]);

    return {
      readyToScheduleCount: result?.readyToScheduleCount?.[0]?.count || 0,
      scheduledAndOpenCount: result?.scheduledAndOpenCount?.[0]?.count || 0,
      pendingCloseCount: result?.pendingCloseCount?.[0]?.count || 0,
      cancelledCount: result?.cancelledCount?.[0]?.count || 0,
      totalRevenue: result?.totalRevenue?.[0]?.total || 0,
      totalProducedRevenue: result?.totalProducedRevenue?.[0]?.total || 0,
    };
  };



  findByPeriod = (query: any) => Overview.find(query).sort({ periodIndex: 1 });
}
