import { Router } from "express";
import { authMiddleware, commonController } from "../../container";

const commonRoute = Router();

commonRoute.use(authMiddleware.authenticate)

commonRoute.post("/upsert-variable", commonController.upsertVariable);
commonRoute.post("/cluster", commonController.createCluster);

commonRoute.get("/get-variable", commonController.getVariable);
commonRoute.get("/notification", commonController.getNotification);
commonRoute.get("/cluster", commonController.getCluster);
commonRoute.get(
  "/salesrep-leaderboard",
  commonController.getSalesRepLeaderboard
);
commonRoute.get("/my-stats", commonController.getMyStats);


export default commonRoute;
