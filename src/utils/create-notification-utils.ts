import { Notification } from "../modules/common/notification.model";
import { Document } from "mongoose";

// Define the input type for creating a notification
interface CreateNotificationInput {
  type: string;
  message: string;
  forUser?: string; // optional, since your schema doesn’t require it
}

// Function to create a notification
export const createNotification = async (
  input: CreateNotificationInput
): Promise<Document> => {
  const { forUser, type, message } = input;

  const newNotification = new Notification({ forUser, type, message });
  return await newNotification.save();
};
