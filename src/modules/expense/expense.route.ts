import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CreateMileageSchema } from "./expense.schema";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";
import { expenseController } from "../../container";

const expenseRoute = Router();


expenseRoute.post(
  "/create-mileage",
  uploadFile({
    fieldName: "file",
    uploadType: "single",
  }),
  validate(CreateMileageSchema),
  expenseController.createNewMileage
);
expenseRoute.get("/get-all-mileage", expenseController.getAllMileage);
expenseRoute.get("/get-mileage/:mileageId", expenseController.getMileageById);

export default expenseRoute;
