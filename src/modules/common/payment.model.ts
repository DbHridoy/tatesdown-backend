import { model, Schema, Types } from "mongoose";

const paymentSchema = new Schema({
    salesRepId: { type: Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String },
    paymentStatus: { type: String },
    taxStatus: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export const SalesRepPayment = model("SalesRepPayment", paymentSchema);
