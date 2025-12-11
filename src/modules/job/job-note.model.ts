import { model, Schema, Types } from "mongoose";

const JobNoteSchema = new Schema({
  jobId: {
    type: Types.ObjectId,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
});

const JobNote = model("JobNote", JobNoteSchema);

export default JobNote;
