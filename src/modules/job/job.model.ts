import { model, Schema, Document, Types } from "mongoose";
import { commonService } from "../../container";

export interface JobDocument extends Document {
  customJobId: string;
  quoteId: Types.ObjectId;
  title: string;
  description?: string;
  estimatedPrice: number;
  downPayment: number;
  budgetSpent: number;
  startDate: Date;
  status:
    | "Pending"
    | "Pending Close"
    | "Scheduled"
    | "In Progress"
    | "On Hold"
    | "Completed"
    | "Cancelled";
}

const JobSchema = new Schema<JobDocument>(
  {
    customJobId: {
      type: String,
      unique: true, // 🔐 Prevent duplicates
      index: true,
    },

    quoteId: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
      unique: true, // 🔒 One Job per Quote
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

    budgetSpent: {
      type: Number,
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
        "Pending Close",
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

JobSchema.virtual("notes", {
  ref: "JobNote",
  localField: "_id",
  foreignField: "jobId",
});

JobSchema.virtual("designConsultaion", {
  ref: "DesignConsultation",
  localField: "_id",
  foreignField: "jobId",
});

JobSchema.pre<JobDocument>("save", async function (next) {
  if (!this.customJobId) {
    this.customJobId = await commonService.generateSequentialId("J", "job");
  }
});

export const Job = model<JobDocument>("Job", JobSchema);
