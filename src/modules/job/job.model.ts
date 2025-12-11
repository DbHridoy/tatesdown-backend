import { Schema, model, Types, Document } from "mongoose";

// 1️⃣ Define TypeScript interface
export interface IJob extends Document {
  clientId: Types.ObjectId;
  title: string;
  estimatedPrice: number;
  downPayment: number;
  jobStatus: string;
  // Virtuals
  remaining?: number;
  budgetProgress?: number;
}

// 2️⃣ Define Schema
const JobSchema = new Schema<IJob>(
  {
    clientId: { type: Types.ObjectId, required: true, ref: "Client" },
    title: { type: String, required: true },
    estimatedPrice: { type: Number, required: true },
    downPayment: { type: Number, required: true },
    jobStatus: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // include virtuals when converting to JSON
    toObject: { virtuals: true }, // include virtuals when using toObject
  }
);

// 3️⃣ Virtual: remaining = estimatedPrice - downPayment
JobSchema.virtual("remaining").get(function (this: IJob) {
  return this.estimatedPrice - this.downPayment;
});

// 4️⃣ Virtual: budgetProgress = (downPayment / estimatedPrice) * 100
JobSchema.virtual("budgetProgress").get(function (this: IJob) {
  if (this.estimatedPrice === 0) return 0; // avoid division by zero
  return (this.downPayment / this.estimatedPrice) * 100;
});

JobSchema.virtual("jobNote", {
  ref: "JobNote",
  localField: "_id",
  foreignField: "jobId",
});

// 5️⃣ Create model
const Job = model<IJob>("Job", JobSchema);

export default Job;
