import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    cluster: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    comissionRate: {
        type: Number,
        default: null
    },
    comissionPending: {
        type: Number,
        default: null
    },
    comissionEarned: {
        type: Number,
        default: null
    }
});

const User = model("User", userSchema);

export default User;
