import { model, Schema, Document, Types } from "mongoose";
import { commonService } from "../../container";

// Note interface & schema
export interface INote extends Document {
  note: string;
  createdBy: Types.ObjectId;
}

const NoteSchema = new Schema<INote>({
  note: { type: String, required: true },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
});

// Design Consultation interface & schema
export interface IDesignConsultation extends Document {
  products: string;
  colorCodes: string;
  estimatedGallos: string;
  upsellDescription: string;
  upsellValue: string;
  addedHours: number;
  estimatedStartDate: Date;
  file: string;
}

const DesignConsultationSchema = new Schema<IDesignConsultation>({
  products: { type: String, required: true },
  colorCodes: { type: String },
  estimatedGallos: { type: String },
  upsellDescription: { type: String },
  upsellValue: { type: String },
  addedHours: { type: Number, default: 0 },
  estimatedStartDate: { type: Date },
  file: { type: String },
});

// Main Job interface & schema
export interface JobDocument extends Document {
  customId: string;
  clientId: Types.ObjectId;
  salesRepId: Types.ObjectId;
  quoteId: Types.ObjectId;
  title: string;
  notes?: INote[];
  designConsultation?: IDesignConsultation[];
  estimatedPrice: number;
  downPayment: number;
  startDate: Date;
  status:
    | "Pending"
    | "Scheduled"
    | "In Progress"
    | "On Hold"
    | "Completed"
    | "Cancelled";
}

const JobSchema = new Schema<JobDocument>(
  {
    quoteId: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
      unique: true,
    },

    customId: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true },

    notes: { type: [NoteSchema], default: [] },
    designConsultation: { type: [DesignConsultationSchema], default: [] },

    estimatedPrice: { type: Number, required: true, min: 0 },
    downPayment: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },

    status: {
      type: String,
      enum: [
        "Pending",
        "Scheduled",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre-save hook to generate custom job ID
JobSchema.pre<JobDocument>("save", async function (next) {
  if (!this.customId) {
    this.customId = await commonService.generateSequentialId("J", "job");
  }
});

export const Job = model<JobDocument>("Job", JobSchema);
