import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CreateQuoteSchema, UpdateQuoteSchema } from "./quote.schema";
import { authMiddleware, quoteController } from "../../container";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";

const quoteRoute = Router();

quoteRoute.use(authMiddleware.authenticate);

quoteRoute.post(
  "/",
  uploadFile({
    fieldName: "bidSheet",
    uploadType: "single",
  }),
  quoteController.createQuote
);

quoteRoute.get("/", quoteController.getAllQuote);
quoteRoute.get("/:quoteId", quoteController.getSingleQuote);

quoteRoute.patch(
  "/:quoteId",
  uploadFile({
    fieldName: "bidSheet",
    uploadType: "single",
  }),
  // validate(UpdateQuoteSchema),
  quoteController.updateQuoteById
);

quoteRoute.delete("/:quoteId", quoteController.deleteQuoteById);

export default quoteRoute;
