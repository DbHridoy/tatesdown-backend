import { ObjectId } from "mongoose";

export interface quoteDetails {
  clientId: ObjectId;
  estimatedPrice: Number;
  bidSheed: String;
  bookedOnTheSpot: Boolean;
  expiryDate: Date;
}

export interface updateQuoteDetails
  extends Partial<Omit<quoteDetails, "clientId">> {}
