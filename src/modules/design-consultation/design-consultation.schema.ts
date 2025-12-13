import z from "zod";
const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
export const DesignConsultationSchema = z.object({
  jobId: ObjectIdSchema,
  products: z.string(),
  colorCodes: z.string(),
  estimatedGallos: z.string(),
  upsellDescription: z.string(),
  upsellValue: z.string(),
  addedHours: z.number(),
  estimatedStartDate: z.coerce.date(),
  file: z.string(),
});


export const CreateDesignConsultationSchema=DesignConsultationSchema
