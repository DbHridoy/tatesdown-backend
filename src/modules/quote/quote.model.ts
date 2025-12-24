import { model, Schema, Types } from "mongoose";
import { commonService } from "../../container";

interface INote extends Document {
  note: string;
  createdBy: Types.ObjectId;
}

const NoteSchema=new Schema<INote>({
  note:{type:String,required:true},
  createdBy:{type:Types.ObjectId,ref:"User",required:true}
})
export interface QuoteDocument {
  customId: string;
  clientId: Types.ObjectId;
  salesRepId: Types.ObjectId;
  estimatedPrice: number;
  bidSheet: string;
  bookedOnSpot: string;
  expiryDate: Date;
  notes?: INote[];
  status?: string;
}

const QuoteSchema = new Schema<QuoteDocument>(
  {
    clientId: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
    },

    customId: {
      type: String,
    },
    estimatedPrice: {
      type: Number,
      required: true,
    },
    bidSheet: {
      type: String,
      required: true,
    },
    bookedOnSpot: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: [NoteSchema],
      default: [],
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook
QuoteSchema.pre("save", async function () {
  if (!this.customId) {
    this.customId = await commonService.generateSequentialId("Q", "quote");
  }
});

export const Quote = model<QuoteDocument>("Quote", QuoteSchema);
