import { Schema, model, Types } from "mongoose";

const jobSchema = new Schema(
  {
    salesRepId: {
      type: Types.ObjectId,
      ref: "SalesRep",
      required: true,
    },

    clientId: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
    },

    quoteId: {
      type: Types.ObjectId,
      ref: "Quote",
      required: true,
    },

    budgetSpent: Number,
    downPayment: Number,

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

jobSchema.index({ salesRepId: 1 });

export const Job = model("Job", jobSchema);
