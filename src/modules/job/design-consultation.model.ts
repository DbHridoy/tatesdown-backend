import { model, Schema, Types, Document } from "mongoose";

export interface DesignConsultationDocument extends Document {
  clientId: Types.ObjectId;
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
}

const DesignConsultationSchema = new Schema<DesignConsultationDocument>(
  {
    clientId: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
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

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DesignConsultationSchema.virtual("contract", {
  ref: "Contract",
  localField: "_id",
  foreignField: "designConsultationId",
})

export const DesignConsultation = model<DesignConsultationDocument>(
  "DesignConsultation",
  DesignConsultationSchema
);
