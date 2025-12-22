import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CreateQuoteSchema, UpdateQuoteSchema } from "./quote.schema";
import { quoteController } from "../../container";

const quoteRoute = Router();


quoteRoute.post(
  "/create-quote",
  validate(CreateQuoteSchema),
  quoteController.createQuote
);
quoteRoute.get("/get-all-quotes", quoteController.getAllQuote);
quoteRoute.delete("/delete-quote/:quoteId",quoteController.deleteQuoteById)
quoteRoute.get("/get-single-quote/:quoteId", quoteController.getSingleQuote);
quoteRoute.patch("/update-quote/:quoteId",validate(UpdateQuoteSchema),quoteController.updateQuoteById)

export default quoteRoute;
