import { model, Schema, Document } from "mongoose";
import { commonService } from "../../container";

export interface QuoteDocument extends Document {
  quoteId: string;
  clientId: string;
  amount: number;
  notes?: string;
}

const QuoteSchema = new Schema<QuoteDocument>(
  {
    quoteId: { type: String, required: true },
    clientId: { type: String, required: true },
    amount: { type: Number, required: true },
    notes: { type: String },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre-save hook
QuoteSchema.pre<QuoteDocument>("save", async function (this: QuoteDocument) {
  if (!this.quoteId) {
    this.quoteId = await commonService.generateSequentialId("Q", "quote");
  }
});

export const Quote = model<QuoteDocument>("Quote", QuoteSchema);
