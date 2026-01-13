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
import { FiscalYear } from "./fiscalYear.model";
import { Overview } from "./overview.model";

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

  getActiveFiscalYear = () => FiscalYear.findOne({ isActive: true });

  deactivateAllFiscalYears = () =>
    FiscalYear.updateMany({}, { isActive: false });

  createFiscalYear = (data: any) => FiscalYear.create(data);

  incrementOverview = async ({
    fiscalYearId,
    periodType,
    periodIndex,
    periodStart,
    inc,
  }: any) => {
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
