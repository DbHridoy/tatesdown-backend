import { Schema, model } from "mongoose";

const ClusterSchema = new Schema(
  {
    clusterName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Cluster = model("Cluster", ClusterSchema);