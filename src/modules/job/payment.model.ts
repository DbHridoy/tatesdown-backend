import { model, Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    salesRepId: { type: Schema.Types.ObjectId, ref: "User" },
    paymentAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

PaymentSchema.pre("save", function (next) {
  const payment = this as any;
  payment.remainingAmount =
    (payment.paymentAmount || 0) - (payment.paidAmount || 0);
});

const Payment = model("Payment", PaymentSchema);
export default Payment;
