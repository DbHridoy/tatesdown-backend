import { model, Schema, Document } from "mongoose";
import { commonService } from "../../container";

export interface ClientDocument extends Document {
  customClientId: string;
  clientName: string;
  partnerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  leadSource: "Door" | "Inbound" | "Social";
  rating: number;
  callStatus: "Not Called" | "Picked-Up Yes" | "Picked-Up No" | "No Pickup";
}

const ClientSchema = new Schema<ClientDocument>(
  {
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
    rating: { type: Number, required: true },
    callStatus: {
      type: String,
      enum: ["Not Called", "Picked-Up Yes", "Picked-Up No", "No Pickup"],
      default: "Not Called",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
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
    this.customClientId = await commonService.generateSequentialId("C", "client");
  }
});

export const Client = model<ClientDocument>("Client", ClientSchema);
