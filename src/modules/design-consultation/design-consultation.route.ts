import { Router } from "express";
import { DesignConsultationRepository } from "./design-consultation.repository";
import { DesignConsultationService } from "./design-consultation.service";
import { DesignConsultationController } from "./design-consultation.controller";
import { CreateDesignConsultationSchema } from "./design-consultation.schema";
import { validate } from "../../middlewares/validate.middleware";

const designConsultationRoute = Router();

const designConsultationRepo = new DesignConsultationRepository();
const designConsultationService = new DesignConsultationService(
  designConsultationRepo
);
const designConsultationController = new DesignConsultationController(
  designConsultationService
);

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
