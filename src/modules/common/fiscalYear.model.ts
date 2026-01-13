// models/FiscalYear.ts
import { Schema, model } from "mongoose";

const FiscalYearSchema = new Schema(
  {
    name: { type: String, required: true }, // FY 2025–2026
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const FiscalYear = model("FiscalYear", FiscalYearSchema);
