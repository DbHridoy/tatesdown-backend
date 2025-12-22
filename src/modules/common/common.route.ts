import { Router } from "express";
import { commonController } from "../../container";

const commonRoute=Router()

commonRoute.post("/upsert-variable",commonController.upsertVariable)
commonRoute.get("/get-variable",commonController.getVariable)

export default commonRoute