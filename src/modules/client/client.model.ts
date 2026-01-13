import { Schema, model, Types } from "mongoose";
import { Document } from "mongoose";
import { commonService } from "../../container";

export interface ClientDocument extends Document {
  salesRepId: Types.ObjectId;
  customClientId: string;
  clientName: string;
  partnerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  leadSource: "Door to Door" | "Inbound" | "Social";
  leadStatus: "Not quoted" | "Quoted" | "Job";
  rating: number;
  createdBy: Types.ObjectId;
}
const clientSchema = new Schema(
  {
    salesRepId: {
      type: Types.ObjectId,
      ref: "SalesRep",
    },

    customClientId: String,
    clientName: { type: String, required: true },
    partnerName: String,
    phoneNumber: String,
    email: String,
    address: String,

    leadSource: {
      type: String,
      enum: ["Door to Door", "Inbound", "Social"],
    },

    leadStatus: {
      type: String,
      enum: ["Not quoted", "Quoted", "Job"],
      default: "Not quoted",
    },

    rating: Number,
    callStatus: { type: String, default: "Not Called" },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

clientSchema.index({ salesRepId: 1 });

// Virtuals
clientSchema.virtual("callLogs", {
  ref: "Call",
  localField: "_id",
  foreignField: "clientId",
});

clientSchema.virtual("notes", {
  ref: "ClientNote",
  localField: "_id",
  foreignField: "clientId",
});

// Pre-save hook for sequential ID
clientSchema.pre<ClientDocument>("save", async function (this: ClientDocument) {
  if (!this.customClientId) {
    this.customClientId = await commonService.generateSequentialId(
      "C",
      "client"
    );
  }
});

export const Client = model("Client", clientSchema);
