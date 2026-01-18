import { model, Schema, Types } from "mongoose";
import { Client } from "../client/client.model"; // adjust path if needed

export interface CallLogDocument {
  clientId: Types.ObjectId;
  callAt: Date;
  status:
  | "Not Called"
  | "Picked-Up: Appointment Booked"
  | "Picked-Up: No Appointment"
  | "No Pickup";
  reason?: string;
  note?: string;
  createdBy: Types.ObjectId;
}

const CallLogSchema = new Schema<CallLogDocument>(
  {
    clientId: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    callAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Not Called",
        "Picked-Up: Appointment Booked",
        "Picked-Up: No Appointment",
        "No Pickup",
      ],
      required: true,
    },
    reason: String,
    note: String,

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * 🔁 Helper: update client's callStatus with latest call
 */
async function syncClientCallStatus(clientId: Types.ObjectId) {
  const latestCall = await Call.findOne({ clientId })
    .sort({ createdAt: -1 })
    .select("status");

  await Client.findByIdAndUpdate(clientId, {
    callStatus: latestCall?.status ?? null,
  });
}

/**
 * ✅ After CREATE
 */
CallLogSchema.post("save", async function (doc) {
  await syncClientCallStatus(doc.clientId);
});

/**
 * ✅ After UPDATE (findOneAndUpdate)
 */
CallLogSchema.post("findOneAndUpdate", async function (doc) {
  if (doc?.clientId) {
    await syncClientCallStatus(doc.clientId);
  }
});

/**
 * ✅ After DELETE
 */
CallLogSchema.post("findOneAndDelete", async function (doc) {
  if (doc?.clientId) {
    await syncClientCallStatus(doc.clientId);
  }
});

const Call = model<CallLogDocument>("Call", CallLogSchema);
export default Call;
