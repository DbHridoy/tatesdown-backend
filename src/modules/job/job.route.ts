import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  CreateJobNoteSchema,
  CreateJobSchema,
  UpdateJobSchema,
} from "./job.schema";
import { jobController } from "../../container";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";

const jobRoute = Router();

jobRoute.post("/", jobController.createNewJob);
jobRoute.post(
  "/job-note",
  uploadFile({
    fieldName: "file",
    uploadType: "single",
  }),
  jobController.createJobNote
);
jobRoute.post(
  "/design-consultation",
  uploadFile({
    fieldName: "file",
    uploadType: "single",
  }),
  jobController.createNewDesignConsultation
);

jobRoute.get("/", jobController.getAllJobs);
jobRoute.get("/:jobId", jobController.getJobById);
jobRoute.get("/design-consultation", jobController.getAllDesignConsultation);
jobRoute.get(
  "/design-consultation/:id",
  jobController.getDesignConsultationById
);

jobRoute.patch(
  "/:jobId",
  validate(UpdateJobSchema),
  jobController.updateJobById
);

jobRoute.delete("/:jobId", jobController.deleteJobById);

export default jobRoute;
