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
});

const User = model("User", userSchema);

export default User;
