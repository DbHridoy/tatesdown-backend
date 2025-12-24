import { Schema, Types, model } from "mongoose";

interface IMileage {
  salesRepId: Types.ObjectId;
  month: string;
  year: number;
  totalMilesDriven: number;
  file: string;
  note?: string;
  deduction: number;
  status: "pending" | "approved" | "rejected";
}

const MileageSchema = new Schema<IMileage>(
  {
    salesRepId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    month: { type: String, required: true },
    year: { type: Number, required: true },
    totalMilesDriven: { type: Number, required: true },
    file: { type: String, required: true },
    note: { type: String },
    deduction: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

const Mileage = model<IMileage>("Mileage", MileageSchema);
export default Mileage;
