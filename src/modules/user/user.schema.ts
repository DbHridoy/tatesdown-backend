import z from "zod";

const UserSchema = z.object({
  fullName: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  cluster: z.string(),
  role: z.enum(["admin", "sales-rep", "production-manager"]),
  password: z.string(),
  profileImage: z.string().optional(),
});

export const UpdateUserSchemaForOtherRoles = UserSchema.omit({
  role: true,
  cluster: true,
}).partial();
