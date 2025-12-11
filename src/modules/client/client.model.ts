import { model, Schema } from "mongoose";

const ClientSchema = new Schema(
  {
    clientName: { type: String, required: true },
    partnerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    source: {
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

const virtuals = [
  {
    name: "callLogs",
    ref: "Call",
    localField: "_id",
    foreignField: "clientId",
  },
  {
    name: "notes",
    ref: "ClientNote",
    localField: "_id",
    foreignField: "clientId",
  },
];

virtuals.forEach((v) => {
  ClientSchema.virtual(v.name, {
    ref: v.ref,
    localField: v.localField,
    foreignField: v.foreignField,
  });
});

const Client = model("Client", ClientSchema);
export default Client;
