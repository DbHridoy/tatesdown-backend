import { Router } from "express";
import { commonController } from "../../container";

const commonRoute=Router()

commonRoute.post("/upsert-variable",commonController.upsertVariable)
commonRoute.post("/cluster",commonController.createCluster)

commonRoute.get("/get-variable",commonController.getVariable)
commonRoute.get("/notification",commonController.getNotification)
commonRoute.get("/cluster",commonController.getCluster)

export default commonRoute