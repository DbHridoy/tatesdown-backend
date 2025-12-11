import { Router } from "express";
import { QuoteRepository } from "./quote.repository";
import { QuoteService } from "./quote.service";
import { QuoteController } from "./quote.controller";
import { validate } from "../../middlewares/validate.middleware";
import { CreateQuoteSchema, UpdateQuoteSchema } from "./quote.schema";

const quoteRoute = Router();

const quoteRepo = new QuoteRepository();
const quoteService = new QuoteService(quoteRepo);
const quoteController = new QuoteController(quoteService);

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
