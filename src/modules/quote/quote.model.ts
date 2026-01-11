import { Schema, model, Types } from "mongoose";

const quoteSchema = new Schema(
  {
    salesRepId: {
      type: Types.ObjectId,
      ref: "SalesRep",
      required: true,
      index: true,
    },

    clientId: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
    },

    estimatedPrice: Number,
    bidSheet: String,
    bookedOnSpot: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

quoteSchema.index({ createdAt: -1 });

export const Quote = model("Quote", quoteSchema);
