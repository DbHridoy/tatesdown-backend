import z from "zod";

const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const QuoteSchema = z.object({
  clientId: ObjectIdSchema,
  salesRepId: ObjectIdSchema,
  estimatedPrice: z.coerce.number(),
  bidSheet: z.string(),
  bookedOnSpot: z.string(),
  expiryDate: z.coerce.date(),
  notes:z.string()
});

export const CreateQuoteSchema=QuoteSchema.omit({
  bidSheet:true
})

export const UpdateQuoteSchema = QuoteSchema.omit({ clientId: true,salesRepId:true }) // remove clientId
  .partial().strict();
