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
import User from "../user/user.model";
import { SalesRepPayment } from "./payment.model";

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

const buildDateFilter = (periodType?: string, date?: Date) => {
  if (!periodType || !date) {
    return {};
  }
  const { start, end } = getCalendarPeriodRange(date, periodType);
  return { createdAt: { $gte: start, $lt: end } };
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

  markNotificationRead = async (notificationId: string, userId: string) => {
    const updated = await Notification.findOneAndUpdate(
      { _id: notificationId, forUser: userId, isRead: false },
      { isRead: true },
      { new: true }
    );
    if (updated) {
      return updated;
    }
    return Notification.findOne({ _id: notificationId, forUser: userId });
  };

  getAdminStats = async (periodType?: string, date?: Date) => {
    const dateFilter = buildDateFilter(periodType, date);
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
      Client.countDocuments({ ...dateFilter }),
      Quote.countDocuments({ ...dateFilter }),
      Job.countDocuments({ ...dateFilter }),
      Job.countDocuments({ status: "Ready to Schedule", ...dateFilter }),
      Job.countDocuments({ status: "Scheduled and Open", ...dateFilter }),
      Job.countDocuments({ status: "Pending Close", ...dateFilter }),
      Job.countDocuments({ status: "Closed", ...dateFilter }),
      Job.countDocuments({ status: "Cancelled", ...dateFilter }),
      Job.aggregate([
        { $match: { status: "Ready to Schedule", ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: "Scheduled and Open", ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: "Pending Close", ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: "Closed", ...dateFilter } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        { $match: { status: { $ne: "Cancelled" }, ...dateFilter } },
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
      totalRevenueSold: readyToScheduleAgg[0]?.total || 0,
      totalRevenuePending:
        (scheduledAndOpenAgg[0]?.total || 0) +
        (pendingCloseAgg[0]?.total || 0),
      totalRevenueProduced: closedAgg[0]?.total || 0,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
    };
  };

  getSalesRepStats = async (
    salesRepId: string,
    periodType?: string,
    date?: Date
  ) => {
    const dateFilter = buildDateFilter(periodType, date);
    const totalDeduction = await Mileage.aggregate([
      {
        $match: {
          salesRepId: new Types.ObjectId(salesRepId),
          ...dateFilter,
        },
      },
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
            status: { $ne: "Closed" },
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
            status: { $ne: "Closed" },
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
      totalRevenueSold: revenueEarnedAgg[0]?.total || 0,
      totalRevenueProduced: revenueProducedAgg[0]?.total || 0,
    };
  };

  getSalesRepPersonalStats = async (
    userId: string,
    periodType?: string,
    date?: Date
  ) => {
    const dateFilter = buildDateFilter(periodType, date);
    const salesRepObjectId = new Types.ObjectId(userId);
    const [
      totalClients,
      totalQuotes,
      totalJobs,
      readyToScheduleAgg,
      closedAgg,
      pendingAgg,
      variable,
    ] = await Promise.all([
      Client.countDocuments({ salesRepId: salesRepObjectId, ...dateFilter }),
      Quote.countDocuments({ salesRepId: salesRepObjectId, ...dateFilter }),
      Job.countDocuments({ salesRepId: salesRepObjectId, ...dateFilter }),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: "Ready to Schedule",
            ...dateFilter,
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: "Closed",
            ...dateFilter,
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Job.aggregate([
        {
          $match: {
            salesRepId: salesRepObjectId,
            status: { $ne: "Closed" },
            ...dateFilter,
          },
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Variable.findOne().select("salesRepCommissionRate"),
    ]);

    const commissionRate = Number(variable?.salesRepCommissionRate || 0);
    const normalizedCommissionRate = commissionRate / 100;
    const totalRevenueSold = readyToScheduleAgg[0]?.total || 0;
    const totalRevenueProduced = closedAgg[0]?.total || 0;
    const totalCommissionEarned =
      (closedAgg[0]?.total || 0) * normalizedCommissionRate;
    const totalCommissionPaid =
      totalRevenueProduced * normalizedCommissionRate;
    const totalCommissionPending =
      (pendingAgg[0]?.total || 0) * normalizedCommissionRate;

    return {
      totalClients,
      totalQuotes,
      totalJobs,
      totalRevenueSold,
      totalRevenueProduced,
      totalCommissionEarned,
      totalCommissionPaid,
      totalCommissionPending,
    };
  };

  getUserStatsById = async (
    userId: string,
    periodType?: string,
    date?: Date
  ) => {
    const user = await User.findById(userId).select(
      "_id fullName email role"
    );
    if (!user) {
      return null;
    }

    if (user.role === "Sales Rep") {
      const salesRepStats = await this.getSalesRepPersonalStats(
        user._id.toString(),
        periodType,
        date
      );
      return {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        stats: salesRepStats,
      };
    }

    if (user.role === "Production Manager") {
      const productionStats = await this.getProductionManagerJobStats(
        user._id.toString(),
        periodType,
        date
      );
      return {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        stats: productionStats,
      };
    }

    return {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      stats: null,
    };
  };

  createSalesRepPayment = async (paymentInfo: any) => {
    const payment = new SalesRepPayment(paymentInfo);
    return payment.save();
  };

  getSalesRepPayments = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(
      SalesRepPayment,
      query
    );
    const finalFilter = {
      ...filter,
      ...search,
    };
    const [payments, total] = await Promise.all([
      SalesRepPayment.find(finalFilter, null, options),
      SalesRepPayment.countDocuments(finalFilter),
    ]);
    return { data: payments, total };
  };

  deleteSalesRepPayment = async (paymentId: string) => {
    return SalesRepPayment.findByIdAndDelete(paymentId);
  };

  updateSalesRepPayment = async (paymentId: string, paymentInfo: any) => {
    return SalesRepPayment.findByIdAndUpdate(paymentId, paymentInfo, {
      new: true,
    });
  };

  getProductionManagerJobStats = async (
    productionManagerUserId: string,
    periodType?: string,
    date?: Date
  ) => {
    const dateFilter = buildDateFilter(periodType, date);
    const productionManagerObjectId = new Types.ObjectId(
      productionManagerUserId
    );
    const [result] = await Job.aggregate([
      {
        $facet: {
          readyToScheduleCount: [
            { $match: { status: "Ready to Schedule", ...dateFilter } },
            { $count: "count" },
          ],
          scheduledAndOpenCount: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Scheduled and Open",
                ...dateFilter,
              },
            },
            { $count: "count" },
          ],
          pendingCloseCount: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Pending Close",
                ...dateFilter,
              },
            },
            { $count: "count" },
          ],
          cancelledCount: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Cancelled",
                ...dateFilter,
              },
            },
            { $count: "count" },
          ],
          totalRevenue: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Scheduled and Open",
                ...dateFilter,
              },
            },
            { $group: { _id: null, total: { $sum: "$price" } } },
          ],
          totalProducedRevenue: [
            {
              $match: {
                productionManagerId: productionManagerObjectId,
                status: "Closed",
                ...dateFilter,
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
