// models/Overview.ts
import { Schema, model } from "mongoose";

const OverviewSchema = new Schema(
  {
    fiscalYearId: {
      type: Schema.Types.ObjectId,
      ref: "FiscalYear",
      required: true,
      index: true,
    },

    periodType: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
      index: true,
    },

    periodIndex: {
      type: Number,
      required: true,
      index: true,
    },

    periodStart: {
      type: Date,
      required: true,
    },

    totalUsers: { type: Number, default: 0 },
    totalSalesReps: { type: Number, default: 0 },
    totalProductionManagers: { type: Number, default: 0 },
    totalAdmins: { type: Number, default: 0 },
    totalClusters: { type: Number, default: 0 },
    totalClients: { type: Number, default: 0 },
    totalQuotes: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    totalClosedJobs: { type: Number, default: 0 },
    totalDCs: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OverviewSchema.index(
  { fiscalYearId: 1, periodType: 1, periodIndex: 1 },
  { unique: true }
);

export const Overview = model("Overview", OverviewSchema);
