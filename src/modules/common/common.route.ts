import { Router } from "express";
import { authMiddleware, commonController } from "../../container";

const commonRoute = Router();

commonRoute.use(authMiddleware.authenticate)

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
commonRoute.get("/my-stats", commonController.getMyStats);
commonRoute.get(
  "/sales-rep/:userId/stats",
  commonController.getSalesRepPeriodStats
);


export default commonRoute;
