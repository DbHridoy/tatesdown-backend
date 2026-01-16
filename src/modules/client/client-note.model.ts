import { model, Schema, Types, Document } from "mongoose";

/**
 * Client Note Interface
 */
export interface ClientNoteDocument extends Document {
  clientId: Types.ObjectId;
  quoteId: Types.ObjectId;
  jobId: Types.ObjectId;
  note?: string;
  file?: string;
  createdBy: Types.ObjectId;
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
    quoteId: {
      type: Types.ObjectId,
      ref: "Quote",
      index: true,
    },
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      index: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
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
