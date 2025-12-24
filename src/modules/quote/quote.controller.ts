import { Request, Response, NextFunction } from "express";
import { HttpCodes } from "../../constants/status-codes";
import { QuoteService } from "./quote.service";
import { logger } from "../../utils/logger";
import mongoose from "mongoose";

export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  createQuote = async (req: Request, res: Response, next: NextFunction) => {
    const quoteInfo = req.body;

    // ✅ parse notes correctly
    if (quoteInfo.notes && typeof quoteInfo.notes === "string") {
      quoteInfo.notes = JSON.parse(quoteInfo.notes);
    }

    logger.info({ quoteInfo }, "QuoteController.createQuote");

    const bidSheet = req.file?.fileUrl;

    const newQuote = {
      ...quoteInfo,
      bidSheet,
    };

    const quote = await this.quoteService.createQuote(newQuote);

    res.status(HttpCodes.Ok).json({
      success: true,
      data: quote,
      message: "Quotes created successfully",
    });
  };

  getAllQuote = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const quote = await this.quoteService.getAllQuote(query);
    res.status(HttpCodes.Ok).json({
      success: true,
      message: "Quotes fetched successfully",
      data: quote,
    });
  };
  getSingleQuote = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.getSingleQuote(quoteId);
    res.status(HttpCodes.Ok).json({
      success: true,
      message: "Quote fetched successfully",
      data: quote,
    });
  };

  updateQuoteById = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quoteInfo = req.body;

    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quoteId",
      });
    }

    logger.info({ quoteInfo }, "QuoteController.updateQuoteById");
    if (quoteInfo.notes && typeof quoteInfo.notes === "string") {
      try {
        quoteInfo.notes = JSON.parse(quoteInfo.notes);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid notes JSON",
        });
      }
    }

    const bidSheet = req.file?.fileUrl;
    if (bidSheet) {
      quoteInfo.bidSheet = bidSheet;
    }

    const quote = await this.quoteService.updateQuoteById(quoteId, quoteInfo);

    res.status(HttpCodes.Ok).json({
      success: true,
      message: "Quote updated successfully",
      data: quote,
    });
  };

  deleteQuoteById = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.deleteQuoteById(quoteId);
    res.status(HttpCodes.Ok).json({
      success: true,
      message: "Quote deleted successfully",
      data: quote,
    });
  };
}
