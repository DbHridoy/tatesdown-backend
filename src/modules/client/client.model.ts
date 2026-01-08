import { model, Schema, Document } from "mongoose";
import { commonService } from "../../container";
import { Types } from "mongoose";

export interface ClientDocument extends Document {
  salesRepId: Types.ObjectId;
  customClientId: string;
  clientName: string;
  partnerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  leadSource: "Door" | "Inbound" | "Social";
  leadStatus: "Not quoted" | "Quoted" | "Job";
  rating: number;
}

const ClientSchema = new Schema<ClientDocument>(
  {
    salesRepId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    customClientId: { type: String },
    clientName: { type: String, required: true },
    partnerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    leadSource: {
      type: String,
      enum: ["Door", "Inbound", "Social"],
      required: true,
    },
    leadStatus: {
      type: String,
      enum: ["Not quoted", "Quoted", "Job"],
      default: "Not quoted",
    },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
ClientSchema.virtual("callLogs", {
  ref: "Call",
  localField: "_id",
  foreignField: "clientId",
});

ClientSchema.virtual("notes", {
  ref: "ClientNote",
  localField: "_id",
  foreignField: "clientId",
});

// Pre-save hook for sequential ID
ClientSchema.pre<ClientDocument>("save", async function (this: ClientDocument) {
  if (!this.customClientId) {
    this.customClientId = await commonService.generateSequentialId(
      "C",
      "client"
    );
  }
});

export const Client = model<ClientDocument>("Client", ClientSchema);
