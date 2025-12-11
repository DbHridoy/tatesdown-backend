import z from "zod";

const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const CreateClientSchema = z.object({
  clientName: z.string(),
  partnerName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  address: z.string(),
  source: z.string(),
  rating: z.number(),
  callStatus: z.enum([
    "Not Called",
    "Picked-Up Yes",
    "Picked-Up No",
    "No Pickup",
  ]),
  callLogs: z.array(ObjectIdSchema).optional(),
  note: z.array(ObjectIdSchema).optional(),
});

export const CreateCallLogSchema = z.object({
  clientId: ObjectIdSchema,
  callAt: z.coerce.date(),
  status: z.enum([
    "Not Called",
    "Picked-Up: Appointment Booked",
    "Picked-Up: No Appointment",
    "No Pickup",
  ]),
  note: z.string(),
});

export const CreateClientNoteSchema = z.object({
  clientId: ObjectIdSchema,
  text: z.string(),
  file: z.array(z.string()).optional(),
});
