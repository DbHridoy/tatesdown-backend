import { model, Schema, Document } from "mongoose";
import { commonService } from "../../container";

export interface JobDocument extends Document {
  jobId: string;
  clientId: string;
  title: string;
  description: string;
  status: string;
}

const JobSchema = new Schema<JobDocument>(
  {
    jobId: { type: String, required: true },
    clientId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "Pending" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre-save hook
JobSchema.pre<JobDocument>("save", async function (this: JobDocument) {
  if (!this.jobId) {
    this.jobId = await commonService.generateSequentialId("J", "job");
  }
});

export const Job = model<JobDocument>("Job", JobSchema);
