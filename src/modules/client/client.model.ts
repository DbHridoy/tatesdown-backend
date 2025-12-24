import { model, Schema, Document, Types } from "mongoose";
import { commonService } from "../../container";

/* -------------------- Subdocument Interfaces -------------------- */

export interface Note {
  note: string;
  file?: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CallLog {
  callDate: Date;
  callTime: string;
  callOutcome: string;
  note: string;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

/* -------------------- Sub Schemas -------------------- */

// ✅ Include _id for each subdocument and timestamps
const NoteSchema = new Schema<Note>(
  {
    note: { type: String, required: true },
    file: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // _id: true by default
);

const CallLogSchema = new Schema<CallLog>(
  {
    callDate: { type: Date, required: true },
    callTime: { type: String, required: true },
    callOutcome: { type: String, required: true },
    note: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // _id: true by default
);

/* -------------------- Client Interface -------------------- */

export interface ClientDocument extends Document {
  customId: string;
  salesRepId: Types.ObjectId;
  clientName: string;
  partnerName?: string;
  phoneNumber: string;
  email: string;
  address: string;
  leadSource: "Door" | "Inbound" | "Social";
  rating: number;
  callStatus: "Not Called" | "Picked-Up Yes" | "Picked-Up No" | "No Pickup";
  notes: Note[];
  callLogs: CallLog[];
}

/* -------------------- Client Schema -------------------- */

const ClientSchema = new Schema<ClientDocument>(
  {
    salesRepId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customId: { type: String, unique: true, index: true },
    clientName: { type: String, required: true, trim: true },
    partnerName: { type: String, trim: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },
    leadSource: { type: String, enum: ["Door", "Inbound", "Social"], required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    callStatus: {
      type: String,
      enum: ["Not Called", "Picked-Up Yes", "Picked-Up No", "No Pickup"],
      default: "Not Called",
    },

    // ✅ Notes and CallLogs now have their own _id and timestamps
    notes: { type: [NoteSchema], default: [] },
    callLogs: { type: [CallLogSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* -------------------- Pre-save Hook -------------------- */

ClientSchema.pre<ClientDocument>("save", async function (next) {
  if (!this.customId) {
    this.customId = await commonService.generateSequentialId("C", "client");
  }
});

/* -------------------- Model -------------------- */

export const Client = model<ClientDocument>("Client", ClientSchema);
