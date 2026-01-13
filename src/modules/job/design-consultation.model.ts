import { model, Schema, Types, Document } from "mongoose";

export interface DesignConsultationDocument extends Document {
  jobId: Types.ObjectId;

  // Product details
  product?: string;
  colorCode?: string;
  estimatedGallons?: number;

  // Upsell
  upsellDescription?: string;
  upsellValue?: string;
  addedHours?: number;

  // Scheduling
  estimatedStartDate?: Date;

  // Contract file
  file?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const DesignConsultationSchema = new Schema<DesignConsultationDocument>(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    /* ---------- Product ---------- */
    product: { type: String },
    colorCode: { type: String },
    estimatedGallons: { type: Number },

    /* ---------- Upsell ---------- */
    upsellDescription: { type: String },
    upsellValue: { type: String },
    addedHours: { type: Number },

    /* ---------- Scheduling ---------- */
    estimatedStartDate: { type: Date },

    /* ---------- File ---------- */
    file: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const DesignConsultation = model<DesignConsultationDocument>(
  "DesignConsultation",
  DesignConsultationSchema
);
