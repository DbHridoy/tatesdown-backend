import { model, Schema } from "mongoose";

const VariableSchema = new Schema(
  {
    singletonKey: {
      type: String,
      default: "VARIABLE_CONFIG",
      unique: true,       // 🔒 hard DB guarantee
      immutable: true,
    },

    mileageRate: {
      type: Number,
      default: 0,
    },
    salesRepCommissionRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Variable = model("Variable", VariableSchema);
