// salesRep.repository.ts
import { Types } from "mongoose";
import { SalesRep } from "./sales-rep.model";
import { logger } from "../../utils/logger";
import { Variable } from "../common/variable.model";

export class SalesRepRepository {
  findByUserId = async (userId: Types.ObjectId) => {
    logger.info({ userId }, "SalesRepRepository.findByUserId");
    return SalesRep.findOne({ userId });
  };

  getLeaderboard = async () => {
    const variable = await Variable.findOne().select("salesRepCommissionRate");
    const commissionRate = Number(variable?.salesRepCommissionRate || 0);

    return SalesRep.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "clients",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$salesRepId", "$$userId"] } } },
            { $count: "count" },
          ],
          as: "clientAgg",
        },
      },
      {
        $lookup: {
          from: "quotes",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$salesRepId", "$$userId"] } } },
            { $count: "count" },
          ],
          as: "quoteAgg",
        },
      },
      {
        $lookup: {
          from: "jobs",
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$salesRepId", "$$userId"] } } },
            {
              $group: {
                _id: null,
                totalJobs: { $sum: 1 },
                totalRevenueEarned: {
                  $sum: {
                    $cond: [
                      { $eq: ["$status", "Ready to Schedule"] },
                      "$price",
                      0,
                    ],
                  },
                },
                totalRevenueProduced: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Closed"] }, "$price", 0],
                  },
                },
                totalCommissionEarnedBase: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Closed"] }, "$price", 0],
                  },
                },
                totalCommissionPaidBase: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "Closed"] }, "$price", 0],
                  },
                },
                totalCommissionPendingBase: {
                  $sum: {
                    $cond: [
                      {
                        $ne: ["$status", "Closed"],
                      },
                      "$price",
                      0,
                    ],
                  },
                },
              },
            },
          ],
          as: "jobAgg",
        },
      },
      {
        $addFields: {
          totalClients: {
            $ifNull: [{ $arrayElemAt: ["$clientAgg.count", 0] }, 0],
          },
          totalQuotes: {
            $ifNull: [{ $arrayElemAt: ["$quoteAgg.count", 0] }, 0],
          },
          totalJobs: {
            $ifNull: [{ $arrayElemAt: ["$jobAgg.totalJobs", 0] }, 0],
          },
          totalRevenueEarned: {
            $ifNull: [{ $arrayElemAt: ["$jobAgg.totalRevenueEarned", 0] }, 0],
          },
          totalRevenueProduced: {
            $ifNull: [
              { $arrayElemAt: ["$jobAgg.totalRevenueProduced", 0] },
              0,
            ],
          },
          totalCommissionEarned: {
            $multiply: [
              {
                $ifNull: [
                  { $arrayElemAt: ["$jobAgg.totalCommissionEarnedBase", 0] },
                  0,
                ],
              },
              commissionRate,
            ],
          },
          totalCommissionPaid: {
            $multiply: [
              {
                $ifNull: [
                  { $arrayElemAt: ["$jobAgg.totalCommissionPaidBase", 0] },
                  0,
                ],
              },
              commissionRate,
            ],
          },
          totalCommissionPending: {
            $multiply: [
              {
                $ifNull: [
                  { $arrayElemAt: ["$jobAgg.totalCommissionPendingBase", 0] },
                  0,
                ],
              },
              commissionRate,
            ],
          },
        },
      },
      {
        $project: {
          clientAgg: 0,
          quoteAgg: 0,
          jobAgg: 0,
        },
      },
      {
        $sort: {
          totalRevenueProduced: -1,
          totalRevenueEarned: -1,
          totalJobs: -1,
          totalQuotes: -1,
          totalClients: -1,
        },
      },
      { $limit: 5 },
    ]);
  };

  getSalesRepProfile = async (salesRepId: Types.ObjectId) => {
    return SalesRep.findById(salesRepId).populate("userId");
  };


  incrementSalesRepStats = async (eventType: string, userId: Types.ObjectId) => {
    const updateFields: any = {};
    const salesRep = await this.findByUserId(userId);
    if (!salesRep) {
      throw new Error("Sales rep profile not found");
    }

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

    return SalesRep.findByIdAndUpdate(salesRep._id, {
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
