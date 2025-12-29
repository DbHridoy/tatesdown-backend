import { Router } from "express";
import { statsController } from "../../container";

const statsRoute=Router()

statsRoute.get("/admin",statsController.getAdminStats)
statsRoute.get("/sales-rep-stats/:salesRepId",statsController.getSalesRepStats)

export default statsRoute