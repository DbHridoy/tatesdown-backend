import { Schema, model, Types, Document } from "mongoose";
import { commonService } from "../../container";

// TypeScript interface for Job
export interface JobDocument extends Document {
  customJobId: string;
  salesRepId: Types.ObjectId;
  clientId: Types.ObjectId;
  quoteId: Types.ObjectId;
  productionManagerId: Types.ObjectId;
  title: string;
  price: number;
  downPayment: number;
  budgetSpent: number;
  downPaymentStatus: "Approved" | "Rejected" | "Pending";
  totalHours: number;
  setupCleanup: number;
  powerwash: number;
  laborHours: number;
  startDate: Date;
  status:
  | "Ready to Schedule"
  | "Scheduled and Open"
  | "Pending Close"
  | "Closed"
  | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema
const jobSchema = new Schema<JobDocument>(
  {
    salesRepId: { type: Types.ObjectId, ref: "User", required: true },
    clientId: { type: Types.ObjectId, ref: "Client", required: true },
    quoteId: { type: Types.ObjectId, ref: "Quote", required: true },
    productionManagerId: { type: Types.ObjectId, ref: "User" },
    customJobId: { type: String, unique: true },
    title: { type: String, required: true },
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
    laborHours: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "Ready to Schedule",
        "Scheduled and Open",
        "Pending Close",
        "Closed",
        "Cancelled",
      ],
      default: "Ready to Schedule",
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
  ref: "ClientNote",
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
