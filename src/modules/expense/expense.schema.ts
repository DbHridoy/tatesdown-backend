import z from "zod";

export const CreateMileageSchema = z.object({
  month: z.string(),
  year: z.string(),
  totalMilesDriven: z.coerce.number(),
  file: z.string(),
  note: z.string().optional(),
});
