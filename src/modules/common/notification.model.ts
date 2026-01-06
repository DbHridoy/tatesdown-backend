import { model, Schema } from "mongoose";

const NotificationSchema = new Schema(
    {
        type: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        forUserRole: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

export const Notification = model("Notification", NotificationSchema);
