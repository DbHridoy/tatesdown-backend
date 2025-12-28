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
jobRoute.get("/design-consultation", jobController.getAllDesignConsultation);
jobRoute.get("/downpayment-request", jobController.getAllDownpaymentRequest);
jobRoute.get("/job-close-approval", jobController.getAllJobCloseApproval);
jobRoute.get(
  "/design-consultation/:id",
  jobController.getDesignConsultationById
);
jobRoute.get("/:jobId", jobController.getJobById);

jobRoute.patch("/downpayment-status", jobController.updateDownpaymentStatus);
jobRoute.patch(
  "/:jobId",
  // validate(UpdateJobSchema),
  jobController.updateJobById
);

jobRoute.delete("/:jobId", jobController.deleteJobById);

export default jobRoute;
