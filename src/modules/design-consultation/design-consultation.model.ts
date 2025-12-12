import { model, Schema, Types } from "mongoose";

const DesignConsultationSchema = new Schema({
  jobId: {
    type: Types.ObjectId,
    ref: "Job",
  },
  products: {
    type: String,
  },
  colorCodes: {
    type: String,
  },
  estimatedGallos: {
    type: String,
  },
  upsellDescription: {
    type: String,
  },
  upsellValue: {
    type: String,
  },
  addedHours: {
    type: Number,
  },
  estimatedStartDate: {
    type: Date,
  },
  file: {
    type: String,
  },
});

const DesignConsultation = model(
  "DesignConsultation",
  DesignConsultationSchema
);

export default DesignConsultation;
