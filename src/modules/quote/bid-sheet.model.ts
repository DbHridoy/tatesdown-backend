import { Schema, model } from "mongoose";

const bidSheetSchema = new Schema(
    {
        clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
        quoteId: { type: Schema.Types.ObjectId, ref: "Quote", required: true },
        bidSheetUrl: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
);


export const BidSheet = model("BidSheet", bidSheetSchema);