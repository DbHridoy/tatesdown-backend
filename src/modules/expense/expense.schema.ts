import z from "zod";

export const MileageSchema = z.object({
  salesRepId: z.string().min(1),
  month: z.string(),
  year: z.string(),
  totalMilesDriven: z.coerce.number(),
  note: z.string().optional(),
});


export const CreateMileageSchema = MileageSchema;
