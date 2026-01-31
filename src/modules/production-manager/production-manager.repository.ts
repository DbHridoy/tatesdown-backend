// salesRep.repository.ts
import { Types } from "mongoose";
import { logger } from "../../utils/logger";
import ProductionManager from "./production-manager.model";

export class ProductionManagerRepository {
  findByUserId = async (userId: Types.ObjectId) => {
    logger.info({ userId }, "ProductionManagerRepository.findByUserId");
    return ProductionManager.findOne({ userId });
  };

  getLeaderboard = async () => {
    return ProductionManager.find()
      .sort({
        totalSold: -1,
        totalJobs: -1,
        totalQuotes: -1,
        totalClients: -1,
      })
      .limit(5)
      .populate("userId");
  };

  getProductionManagerProfile = async (productionManagerId: Types.ObjectId) => {
    return ProductionManager.findById(productionManagerId).populate("userId");
  };

  incrementTotalClients = async (productionManagerId: Types.ObjectId) => {
    return ProductionManager.findByIdAndUpdate(productionManagerId, {
      $inc: { totalClients: 1 },
    });
  };
  
  incrementTotalQuotes = async (productionManagerId: Types.ObjectId) => {
    return ProductionManager.findByIdAndUpdate(productionManagerId, {
      $inc: { totalQuotes: 1 },
    });
  };

  incrementJobCount = async (productionManagerId: Types.ObjectId) => {
    return ProductionManager.findByIdAndUpdate(productionManagerId, {
      $inc: { totalJobs: 1 },
    });
  };

  updateCommissionEarned = async (
    productionManagerId: Types.ObjectId,
    amount: number
  ) => {
    return ProductionManager.findByIdAndUpdate(productionManagerId, {
      $inc: { commissionEarned: amount },
    });
  };
}
