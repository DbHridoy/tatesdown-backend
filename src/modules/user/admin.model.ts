import { Schema, Types, model } from "mongoose";

const adminSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Admin = model("Admin", adminSchema);

export default Admin;
