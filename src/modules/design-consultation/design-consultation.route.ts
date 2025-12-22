import { Router } from "express";
import { CreateDesignConsultationSchema } from "./design-consultation.schema";
import { validate } from "../../middlewares/validate.middleware";
import { designConsultationController } from "../../container";

const designConsultationRoute = Router();


designConsultationRoute.post(
  "/create-design-consultation",
  validate(CreateDesignConsultationSchema),
  designConsultationController.createNewDesignConsultation
);
designConsultationRoute.get(
  "/get-all-design-consultation",
  designConsultationController.getAllDesignConsultation
);
designConsultationRoute.get(
  "/get-design-consultation-by-id/:id",
  designConsultationController.getDesignConsultationById
);

export default designConsultationRoute;
