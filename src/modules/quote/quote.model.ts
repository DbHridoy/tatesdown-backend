import { model, Schema, Document } from "mongoose";
import { generateSequentialId } from "../common/counter.service";

export interface QuoteDocument extends Document {
  quoteId: string;
  jobId: string;
  amount: number;
  notes?: string;
}

const QuoteSchema = new Schema<QuoteDocument>(
  {
    quoteId: { type: String, required: true },
    jobId: { type: String, required: true },
    amount: { type: Number, required: true },
    notes: { type: String },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre-save hook
QuoteSchema.pre<QuoteDocument>("save", async function (this: QuoteDocument) {
  if (!this.quoteId) {
    this.quoteId = await generateSequentialId("Q", "quote");
  }
});

export const Quote = model<QuoteDocument>("Quote", QuoteSchema);
