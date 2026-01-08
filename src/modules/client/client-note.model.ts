import { model, Schema, Types } from "mongoose";

const ClientNoteSchema = new Schema({
  clientId: {
    type: Types.ObjectId,
    ref: "Client",
    required: true,
  },
  note: {
    type: String,
  },
  file: {
    type: String,
  },
});

const clientNote = model("ClientNote", ClientNoteSchema);

export default clientNote;
