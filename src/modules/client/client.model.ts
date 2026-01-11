import { Schema, model, Types } from "mongoose";

const clientSchema = new Schema(
  {
    salesRepId: {
      type: Types.ObjectId,
      ref: "SalesRep",
      required: true,
      index: true,
    },

    customClientId: String,
    clientName: { type: String, required: true },
    partnerName: String,
    phoneNumber: String,
    email: String,
    address: String,

    leadSource: {
      type: String,
      enum: ["Door", "Inbound", "Social"],
    },

    leadStatus: {
      type: String,
      enum: ["Not quoted", "Quoted", "Job"],
      default: "Not quoted",
    },

    rating: Number,
    callStatus: { type: String, default: "Not Called" },
  },
  { timestamps: true }
);

clientSchema.index({ salesRepId: 1 });

export const Client = model("Client", clientSchema);
