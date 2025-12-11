import z from "zod";

const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const CreateQuoteSchema = z.object({
  clientId: ObjectIdSchema,
  estimatedPrice: z.coerce.number(),
  bidSheed: z.string(),
  bookedOnTheSpot: z.boolean(),
  expiryDate: z.coerce.date(),
});

export const UpdateQuoteSchema = CreateQuoteSchema.omit({ clientId: true }) // remove clientId
  .partial().strict();
