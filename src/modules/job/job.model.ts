import { Schema, model, Types, Document } from "mongoose";
import { commonService } from "../../container";

// TypeScript interface for Job
export interface JobDocument extends Document {
  customJobId: string;
  salesRepId: Types.ObjectId;
  clientId: Types.ObjectId;
  quoteId: Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  downPayment: number;
  budgetSpent: number;
  downPaymentStatus: "Approved" | "Rejected" | "Pending";
  totalHours: number;
  setupCleanup: number;
  powerwash: number;
  labourHours: number;
  startDate: Date;
  status:
    | "Ready for DC"
    | "Ready to Schedule"
    | "Scheduled"
    | "In Progress"
    | "On Hold"
    | "Completed"
    | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema
const jobSchema = new Schema<JobDocument>(
  {
    salesRepId: { type: Types.ObjectId, ref: "SalesRep", required: true },
    clientId: { type: Types.ObjectId, ref: "Client", required: true },
    quoteId: { type: Types.ObjectId, ref: "Quote", required: true },
    customJobId: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    downPayment: { type: Number, required: true },
    budgetSpent: { type: Number, default: 0 },
    downPaymentStatus: {
      type: String,
      enum: ["Approved", "Rejected", "Pending"],
      default: "Pending",
    },
    totalHours: { type: Number, default: 0 },
    setupCleanup: { type: Number, default: 0 },
    powerwash: { type: Number, default: 0 },
    labourHours: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "Ready for DC",
        "Ready to Schedule",
        "Scheduled",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
      ],
      default: "Ready for DC",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
jobSchema.index({ salesRepId: 1 });

// Virtuals
jobSchema.virtual("notes", {
  ref: "JobNote",
  localField: "_id",
  foreignField: "jobId",
});

jobSchema.virtual("designConsultation", {
  ref: "DesignConsultation",
  localField: "_id",
  foreignField: "jobId",
});

// Pre-save hook to generate customJobId
jobSchema.pre<JobDocument>("save", async function (next) {
  if (!this.customJobId) {
    this.customJobId = await commonService.generateSequentialId("J", "job");
  }
});

export const Job = model<JobDocument>("Job", jobSchema);
