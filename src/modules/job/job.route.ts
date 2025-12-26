import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  CreateJobNoteSchema,
  CreateJobSchema,
  UpdateJobSchema,
} from "./job.schema";
import { jobController } from "../../container";

const jobRoute = Router();

jobRoute.post("/", jobController.createNewJob);
jobRoute.post(
  "/job-note",
  validate(CreateJobNoteSchema),
  jobController.createJobNote
);

jobRoute.get("/", jobController.getAllJobs);
jobRoute.get("/:jobId", jobController.getJobById);

jobRoute.patch(
  "/:jobId",
  validate(UpdateJobSchema),
  jobController.updateJobById
);

jobRoute.delete("/:jobId", jobController.deleteJobById);

export default jobRoute;
