import { Notification } from "../modules/common/notification.model";
import { Document } from "mongoose";

// Define the input type for creating a notification
interface CreateNotificationInput {
    type: string;
    message: string;
    forUserRole?: string; // optional, since your schema doesn’t require it
}

// Function to create a notification
export const createNotification = async (
    input: CreateNotificationInput
): Promise<Document> => {
    const { type, message, forUserRole } = input;

    const newNotification = new Notification({ type, message, forUserRole });
    return await newNotification.save();
};
