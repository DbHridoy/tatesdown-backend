import { Router } from "express";
import { authMiddleware, jobController } from "../../container";
import { uploadFile } from "../../middlewares/upload.middleware";

const jobRoute = Router();

jobRoute.use(authMiddleware.authenticate);

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
  jobController.createDesignConsultation
);

jobRoute.get("/", jobController.getAllJobs);
jobRoute.get("/design-consultation", jobController.getAllDesignConsultation);
jobRoute.get("/downpayment-request", jobController.getAllDownpaymentRequest);
jobRoute.get("/job-close-approval", jobController.getAllJobCloseApproval);
jobRoute.get(
  "/design-consultation/:id",
  jobController.getDesignConsultationById
);
// jobRoute.get("/payment/:salesRepId",jobController.getAllPaymentBySalesRepId)
jobRoute.get(
  "/sales-rep-jobs/:salesRepId",
  jobController.getAllJobBySalesRepId
);
jobRoute.get("/:jobId", jobController.getJobById);

jobRoute.patch("/downpayment-status", jobController.updateDownpaymentStatus);
jobRoute.patch("/:jobId", jobController.updateJobById);
jobRoute.patch("/:jobId/assign-sales-rep", jobController.assignSalesRep);

jobRoute.delete("/:jobId", jobController.deleteJobById);

export default jobRoute;
