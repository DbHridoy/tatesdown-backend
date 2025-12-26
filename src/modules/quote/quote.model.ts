import { model, Schema, Types } from "mongoose";
import { commonService } from "../../container";

export interface QuoteDocument {
  customQuoteId: string;
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
    customQuoteId: {
      type: String,
    },
    clientId: {
      type: Types.ObjectId,
      ref: "Client",
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
  if (!this.customQuoteId) {
    this.customQuoteId = await commonService.generateSequentialId("Q", "quote");
  }
});

QuoteSchema.index({createdAt:-1})

export const Quote = model<QuoteDocument>("Quote", QuoteSchema);
