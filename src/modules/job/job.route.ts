import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  CreateJobNoteSchema,
  CreateJobSchema,
  UpdateJobSchema,
} from "./job.schema";
import { jobController } from "../../container";

const jobRoute = Router();

jobRoute.post(
  "/create-job",
  validate(CreateJobSchema),
  jobController.createNewJob
);
jobRoute.get("/get-all-jobs", jobController.getAllJobs);
jobRoute.post(
  "/create-job-note",
  validate(CreateJobNoteSchema),
  jobController.createJobNote
);
jobRoute.get("/get-job/:jobId", jobController.getJobById);
jobRoute.patch(
  "/update-job/:jobId",
  validate(UpdateJobSchema),
  jobController.updateJobById
);
jobRoute.delete("/delete-job/:jobId", jobController.deleteJobById);

export default jobRoute;
