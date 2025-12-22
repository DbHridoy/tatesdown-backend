import { Document, Schema, model } from "mongoose";
interface IMileage extends Document {
  month: string;
  year: string;
  totalMilesDriven: number;
  file: string;
  note?: string;
}

const MileageSchema = new Schema<IMileage>(
  {
    month: { type: String, required: true },
    year: { type: String, required: true },
    totalMilesDriven: { type: Number, required: true },
    file: { type: String, required: true },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);


const Mileage = model<IMileage>("Mileage", MileageSchema);
export default Mileage;
