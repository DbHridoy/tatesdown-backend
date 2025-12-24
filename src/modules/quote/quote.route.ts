import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CreateQuoteSchema, UpdateQuoteSchema } from "./quote.schema";
import { quoteController } from "../../container";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";

const quoteRoute = Router();

quoteRoute.post(
  "/create-quote",
  uploadFile({
    fieldName: "bidSheet",
    uploadType: "single",
  }),
  // validate(CreateQuoteSchema),
  quoteController.createQuote
);
quoteRoute.get("/get-all-quotes", quoteController.getAllQuote);
quoteRoute.get("/get-single-quote/:quoteId", quoteController.getSingleQuote);
quoteRoute.patch(
  "/update-quote/:quoteId",
  uploadFile({
    fieldName: "bidSheet",
    uploadType: "single",
  }),
  quoteController.updateQuoteById
);
quoteRoute.delete("/delete-quote/:quoteId", quoteController.deleteQuoteById);

export default quoteRoute;
