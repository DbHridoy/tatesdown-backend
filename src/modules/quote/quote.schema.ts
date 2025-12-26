import z from "zod";

const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const QuoteSchema = z.object({
  clientId: ObjectIdSchema,
  estimatedPrice: z.coerce.number(),
  bookedOnSpot: z.string(),
  expiryDate: z.coerce.date(),
  notes:z.string()
});

export const CreateQuoteSchema=QuoteSchema

export const UpdateQuoteSchema = QuoteSchema.omit({ clientId: true }) // remove clientId
  .partial();
