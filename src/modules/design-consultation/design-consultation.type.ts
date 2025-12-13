import z from "zod";
import { CreateDesignConsultationSchema } from "./design-consultation.schema";

export type createDesignConsultationSchemaType=z.infer<typeof CreateDesignConsultationSchema>