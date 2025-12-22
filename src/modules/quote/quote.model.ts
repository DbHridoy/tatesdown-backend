import { model, Schema, Types } from "mongoose";
import { commonService } from "../../container";

export interface QuoteDocument {
  quoteId: string;
  clientId: Types.ObjectId;
  salesRepId: Types.ObjectId;
  estimatedPrice: number;
  bidSheet: string;
  bookedOnSpot: string;
  expiryDate: Date;
  notes?: string;
  status?: string;
}

const QuoteSchema = new Schema<QuoteDocument>(
  {
    quoteId: {
      type: String,
    },
    clientId: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
    },
    salesRepId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    estimatedPrice: {
      type: Number,
      required: true,
    },
    bidSheet: {
      type: String,
      required: true,
    },
    bookedOnSpot: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook
QuoteSchema.pre("save", async function () {
  if (!this.quoteId) {
    this.quoteId = await commonService.generateSequentialId("Q", "quote");
  }
});

export const Quote = model<QuoteDocument>("Quote", QuoteSchema);
