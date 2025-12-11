import z from "zod";

const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
export const CreateJobSchema = z.object({
  clientId: ObjectIdSchema,
  title: z.string(),
  estimatedPrice: z.coerce.number(),
  downPayment: z.coerce.number(),
  jobStatus: z.string(),
});

export const UpdateJobSchema=CreateJobSchema.omit({clientId:true}).partial().strict()

export const CreateJobNoteSchema = z.object({
  jobId: ObjectIdSchema,
  note: z.string(),
  file: z.string(),
});
