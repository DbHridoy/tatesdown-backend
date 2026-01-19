import { Schema, model } from "mongoose";

const contractSchema = new Schema(
    {
        clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
        jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
        designConsultationId: { type: Schema.Types.ObjectId, ref: "DesignConsultation" },
        contractUrl: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);


export const Contract = model("Contract", contractSchema);
