import { model, Schema, Types } from "mongoose";

const JobNoteSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    authorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const JobNote = model("JobNote", JobNoteSchema);

export default JobNote;
