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

  getSalesRepProfile = async (salesRepId: Types.ObjectId) => {
    return SalesRep.findById(salesRepId).populate("userId");
  };


  incrementSalesRepStats = async (eventType: string, salesRepId: Types.ObjectId) => {
    const updateFields: any = {};

    switch (eventType) {
      case 'client':
        updateFields.totalClients = 1;
        break;
      case 'quote':
        updateFields.totalQuotes = 1;
        break;
      case 'job':
        updateFields.totalJobs = 1;
        break;
      default:
        throw new Error(`Invalid event type: ${eventType}`);
    }

    return SalesRep.findByIdAndUpdate(salesRepId, {
      $inc: updateFields,
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
