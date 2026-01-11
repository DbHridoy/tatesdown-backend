import { model, Schema, Types, Document } from "mongoose";

export interface DesignConsultationDocument extends Document {
  jobId: Types.ObjectId;
  products?: string[]; // assuming multiple products
  colorCodes?: string;
  estimatedGallons?: number; // corrected type
  upsellDescription?: string;
  upsellValue?: number; // corrected type
  addedHours?: number;
  estimatedStartDate?: Date;
  file?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DesignConsultationSchema = new Schema<DesignConsultationDocument>(
  {
    jobId: { type: Types.ObjectId, ref: "Job", required: true },
    products: { type: [String], default: [] },
    colorCodes: { type: String },
    estimatedGallons: { type: Number },
    upsellDescription: { type: String },
    upsellValue: { type: Number },
    addedHours: { type: Number },
    estimatedStartDate: { type: Date },
    file: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster lookups by jobId
DesignConsultationSchema.index({ jobId: 1 });

export const DesignConsultation = model<DesignConsultationDocument>(
  "DesignConsultation",
  DesignConsultationSchema
);
