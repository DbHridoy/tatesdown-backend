import { Schema, model, Types } from "mongoose";

const salesRepSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cluster: String,
    totalClients: { type: Number, default: 0 },
    totalQuotes: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    commissionEarned: { type: Number, default: 0 },
    commissionPaid: { type: Number, default: 0 },
    commissionRemaining: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SalesRep = model("SalesRep", salesRepSchema);
