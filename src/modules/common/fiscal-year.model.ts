// models/FiscalYear.ts
import { Schema, model } from "mongoose";

const FiscalYearSchema = new Schema(
  {
    name: { type: String }, // FY 2025–2026
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

FiscalYearSchema.pre("save", function () {
  this.name = `${this.startDate.toLocaleDateString().split("T")[0]}-${this.endDate.toLocaleDateString().split("T")[0]}`;
});

export const FiscalYear = model("FiscalYear", FiscalYearSchema);
