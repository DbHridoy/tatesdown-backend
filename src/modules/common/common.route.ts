import { Router } from "express";
import { commonController } from "../../container";

const commonRoute=Router()

commonRoute.post("/upsert-variable",commonController.upsertVariable)

commonRoute.get("/get-variable",commonController.getVariable)
commonRoute.get("/notification",commonController.getNotification)

export default commonRoute