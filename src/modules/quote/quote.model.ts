import { model, Schema, Types } from "mongoose";

const QuoteSchema = new Schema({
  clientId: {
    type: Types.ObjectId,
    ref: "Client",
  },
  estimatedPrice: {
    type: Number,
    required: true,
  },
  bidSheed: {
    type: String,
  },
  bookedOnTheSpot: {
    type: Boolean,
  },
  expiryDate: {
    type: Date,
  },
});

const Quote = model("Quote", QuoteSchema);

export default Quote;
