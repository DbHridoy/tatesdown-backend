import { z } from "zod";

// Base user schema
const UserSchema = z.object({
  fullName: z.string(),
  email: z.string().email(), // fixed
  phoneNumber: z.string(),
  address: z.string(),
  cluster: z.string(),
  role: z.enum(["Admin", "Sales Rep", "Production Manager"]),
  password: z.string(),
  profileImage: z.string(),
});

// Schema for updating user (other roles) — role and cluster omitted, all optional
export const UpdateUserSchemaForOtherRoles = UserSchema.omit({
  role: true,
  cluster: true,
}).partial();

// Schema for creating user — phoneNumber, address, profileImage omitted, cluster optional
export const CreateUserSchema = UserSchema.omit({
  phoneNumber: true,
  address: true,
  profileImage: true,
}).extend({
  cluster: z.string().optional(),
});
