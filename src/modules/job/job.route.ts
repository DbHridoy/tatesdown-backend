import { Router } from "express";
import { JobRepository } from "./job.repository";
import { JobService } from "./job.service";
import { JobController } from "./job.controller";
import { validate } from "../../middlewares/validate.middleware";
import { CreateJobNoteSchema, CreateJobSchema, UpdateJobSchema } from "./job.schema";

const jobRoute = Router();

const jobRepo = new JobRepository();
const jobService = new JobService(jobRepo);
const jobController = new JobController(jobService);

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
jobRoute.patch("/update-job/:jobId",validate(UpdateJobSchema), jobController.updateJobById);
jobRoute.delete("/delete-job/:jobId", jobController.deleteJobById);

export default jobRoute;
