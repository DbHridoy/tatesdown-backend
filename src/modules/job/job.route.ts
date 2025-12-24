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

// Single file upload for one design consultation
jobRoute.post(
  "/create-job",
  uploadFile({ fieldName: "designFile", uploadType: "single" }), // adjust for multiple if needed
  jobController.createNewJob
);
// Add a note to a job
jobRoute.patch("/add-note/:jobId", jobController.addJobNote);
jobRoute.patch(
  "/update-job/:jobId",
  uploadFile({ fieldName: "designFile", uploadType: "single" }),jobController.updateJob)


jobRoute.get("/get-all-jobs", jobController.getAllJobs);
// jobRoute.post(
//   "/create-job-note",
//   validate(CreateJobNoteSchema),
//   jobController.createJobNote
// );
jobRoute.get("/get-job/:jobId", jobController.getJobById);
jobRoute.patch(
  "/update-job/:jobId",
  validate(UpdateJobSchema),
  jobController.updateJobById
);
jobRoute.delete("/delete-job/:jobId", jobController.deleteJobById);

export default jobRoute;
