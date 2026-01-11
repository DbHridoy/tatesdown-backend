import { Request, Response, NextFunction } from "express";
import { HttpCodes } from "../../constants/status-codes";
import { QuoteService } from "./quote.service";
import { logger } from "../../utils/logger";
import { SalesRep } from "../user/sales-rep.model";
import { Client } from "../client/client.model";

export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  createQuote = async (req: Request, res: Response, next: NextFunction) => {
    const quoteInfo = req.body;
    const userId = req.user?.userId;
    logger.info({ userId }, "QuoteController.createQuote");
    const salesRepId = await SalesRep.findOne({ userId });
    if (!salesRepId) {
      throw new Error("Sales rep not found");
    }
    const bidSheet = req.file?.fileUrl;
    const newQuote = {
      ...quoteInfo,
      salesRepId: salesRepId._id,
      bidSheet,
    };
    const quote = await this.quoteService.createQuote(newQuote);

    // Update the client leadStatus to "Quoted"
    await Client.findByIdAndUpdate(quote.clientId, { leadStatus: "Quoted" });

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
      data: quote.quote,
      total: quote.total,
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
    const { body } = req;
    if (req.file) {
      body.bidSheet = req.file.fileUrl;
    }
    logger.info({ body }, "QuoteController.updateQuoteById");
    const quote = await this.quoteService.updateQuoteById(quoteId, body);
    res.status(HttpCodes.Ok).json({ quote });
  };

  deleteQuoteById = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.deleteQuoteById(quoteId);
    res.status(HttpCodes.Ok).json({ quote });
  };
}
