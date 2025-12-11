import { ObjectId } from "mongoose";

export interface newJobs {
  clientId: ObjectId;
  title: String;
  estimatedPrice: Number;
  downPayment: Number;
  jobStatus: String;
}

export interface updateJobs extends Partial<Omit<newJobs, "clientId">> {}

export interface jobNote {
  jobId: ObjectId;
  note: String;
  file: String;
}
