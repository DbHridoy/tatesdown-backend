import { model, Schema, Document, Types } from "mongoose";
import { commonService } from "../../container";

export interface JobDocument extends Document {
  jobId: string;               // Auto-generated (J0001, J0002...)
  clientId: Types.ObjectId;
  salesRepId: Types.ObjectId;
  quoteId: Types.ObjectId;
  title: string;
  description?: string;
  estimatedPrice: number;
  downPayment: number;
  startDate: Date;
  status: "Pending" | "Scheduled" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
}

const JobSchema = new Schema<JobDocument>(
  {
    jobId: {
      type: String,
      unique: true,              // 🔐 Prevent duplicates
      index: true,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    salesRepId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quoteId: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
      unique: true,              // 🔒 One Job per Quote
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    estimatedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    downPayment: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Scheduled",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Auto-generate sequential Job ID
 * Example: J0001, J0002
 */
JobSchema.pre<JobDocument>("save", async function (next) {
  if (!this.jobId) {
    this.jobId = await commonService.generateSequentialId("J", "job");
  }
});

export const Job = model<JobDocument>("Job", JobSchema);
