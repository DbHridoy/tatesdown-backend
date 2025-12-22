import z from "zod";

export const MileageSchema = z.object({
  month: z.string(),
  year: z.string(),
  totalMilesDriven: z.coerce.number(),
  file: z.string(),
  note: z.string().optional(),
});

export const CreateMileageSchema = MileageSchema.omit({ file: true });
