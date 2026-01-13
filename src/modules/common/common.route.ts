import { Router } from "express";
import { commonController } from "../../container";

const commonRoute = Router();

commonRoute.post("/upsert-variable", commonController.upsertVariable);
commonRoute.post("/cluster", commonController.createCluster);

commonRoute.get("/get-variable", commonController.getVariable);
commonRoute.get("/notification", commonController.getNotification);
commonRoute.get("/cluster", commonController.getCluster);
commonRoute.get("/admin", commonController.getAdminStats);
commonRoute.get(
  "/salesrep-leaderboard",
  commonController.getSalesRepLeaderboard
);
commonRoute.post("/fiscal-year", commonController.createFiscalYear);
commonRoute.get("/active-fiscal-year", commonController.getActiveFiscalYear);
commonRoute.get("/stats", commonController.getStats);

export default commonRoute;
