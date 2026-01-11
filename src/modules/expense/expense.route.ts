import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CreateMileageSchema } from "./expense.schema";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";
import { authMiddleware, expenseController } from "../../container";

const expenseRoute = Router();

expenseRoute.post(
  "/mileage",
  uploadFile({
    fieldName: "file",
    uploadType: "single",
  }),
  validate(CreateMileageSchema),
  expenseController.createNewMileage
);

expenseRoute.get("/pending-mileage", expenseController.getPendingMileage);
expenseRoute.get(
  "/my-mileage",
  authMiddleware.authenticate,
  expenseController.getMyMileage
);
expenseRoute.get("/all-mileage", expenseController.getAllMileage);
expenseRoute.get("/mileage/:mileageId", expenseController.getMileageById);

expenseRoute.patch("/:mileageId", expenseController.updateMileage);

export default expenseRoute;
