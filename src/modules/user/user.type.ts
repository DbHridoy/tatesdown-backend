import z from "zod";
import { UpdateUserSchemaForOtherRoles } from "./user.schema";

export type updateOtherRoleUserType = z.infer<typeof UpdateUserSchemaForOtherRoles>;
