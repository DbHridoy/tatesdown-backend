import { model, Schema, Types, Document } from "mongoose";

/**
 * Client Note Interface
 */
export interface ClientNoteDocument extends Document {
  clientId: Types.ObjectId;
  note?: string;
  file?: string;
}

/**
 * Client Note Schema
 */
const ClientNoteSchema = new Schema<ClientNoteDocument>(
  {
    clientId: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    note: {
      type: String,
      trim: true,
    },
    file: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * ClientNote Model
 */
const ClientNote = model<ClientNoteDocument>("ClientNote", ClientNoteSchema);

export default ClientNote;
