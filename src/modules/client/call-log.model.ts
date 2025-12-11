import { model, Schema, Types } from "mongoose";

const CallLogSchema = new Schema({
  clientId: {
    type: Types.ObjectId,
    ref: "Client",
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
    default: "Not Called",
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

const Call = model("Call", CallLogSchema);

export default Call;
