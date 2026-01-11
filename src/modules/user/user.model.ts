import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Sales Rep", "Production Manager"],
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

export default User;
