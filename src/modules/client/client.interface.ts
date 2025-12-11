import { Types } from "mongoose";

export interface createClientInterface {
  clientName: string;
  partnerName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  source: string;
  rating: number;
  callLogs?: Types.ObjectId[];
  note?: Types.ObjectId[];
}
