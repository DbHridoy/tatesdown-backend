import { Schema, model, Types } from "mongoose";

const salesRepSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cluster: String,
  },
  { timestamps: true }
);

export const SalesRep = model("SalesRep", salesRepSchema);
