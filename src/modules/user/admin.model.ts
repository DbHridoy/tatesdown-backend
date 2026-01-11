import { Schema, Types, model } from "mongoose";

const adminSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    cluster: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    comission: {
        type: Number,
        default: null
    },

});

const Admin = model("Admin", adminSchema);

export default Admin;
