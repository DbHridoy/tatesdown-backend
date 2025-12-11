import { Router } from "express";
import { ExpenseRepository } from "./expense.repository";
import { ExpenseService } from "./expense.service";
import { ExpenseController } from "./expense.controller";
import { validate } from "../../middlewares/validate.middleware";
import { CreateMileageSchema } from "./expense.schema";

const expenseRoute = Router();

const expenseRepo = new ExpenseRepository();
const expenseService = new ExpenseService(expenseRepo);
const expenseController = new ExpenseController(expenseService);

expenseRoute.post(
  "/create-mileage",
  validate(CreateMileageSchema),
  expenseController.createNewMileage
);
expenseRoute.get("/get-all-mileage", expenseController.getAllMileage);
expenseRoute.get("/get-mileage/:mileageId", expenseController.getMileageById);

export default expenseRoute;
