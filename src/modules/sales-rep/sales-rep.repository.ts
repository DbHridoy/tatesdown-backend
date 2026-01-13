// salesRep.repository.ts
import { Types } from "mongoose";
import { SalesRep } from "./sales-rep.model";
import { logger } from "../../utils/logger";

export class SalesRepRepository {
  findByUserId = async (userId: Types.ObjectId) => {
    logger.info({ userId }, "SalesRepRepository.findByUserId");
    return SalesRep.findOne({ userId });
  };

  getLeaderboard = async () => {
    return SalesRep.find()
      .sort({
        totalSold: -1,
        totalJobs: -1,
        totalQuotes: -1,
        totalClients: -1,
      })
      .limit(5)
      .populate("userId");
  };

  incrementTotalClients = async (salesRepId: Types.ObjectId) => {
    return SalesRep.findByIdAndUpdate(salesRepId, {
      $inc: { totalClients: 1 },
    });
  };
  incrementTotalQuotes = async (salesRepId: Types.ObjectId) => {
    return SalesRep.findByIdAndUpdate(salesRepId, {
      $inc: { totalQuotes: 1 },
    });
  };

  incrementJobCount = async (salesRepId: Types.ObjectId) => {
    return SalesRep.findByIdAndUpdate(salesRepId, {
      $inc: { totalJobs: 1 },
    });
  };

  updateCommissionEarned = async (
    salesRepId: Types.ObjectId,
    amount: number
  ) => {
    return SalesRep.findByIdAndUpdate(salesRepId, {
      $inc: { commissionEarned: amount },
    });
  };
}
