import { Request, Response, NextFunction } from "express";
import { HttpCodes } from "../../constants/status-codes";
import { QuoteService } from "./quote.service";
import { logger } from "../../utils/logger";

export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  createQuote = async (req: Request, res: Response, next: NextFunction) => {
    const quoteInfo = req.body;
    const bidSheet = req.file?.fileUrl;
    const newQuote = {
      ...quoteInfo,
      bidSheet,
    };
    const quote = await this.quoteService.createQuote(newQuote);
    res
      .status(HttpCodes.Ok)
      .json({
        success: true,
        data: quote,
        message: "Quotes created successfully",
      });
  };
  
  getAllQuote = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const quote = await this.quoteService.getAllQuote(query);
    res
      .status(HttpCodes.Ok)
      .json({
        success: true,
        message: "Quotes fetched successfully",
        data: quote.quote,
        total:quote.total,
      });
  };
  getSingleQuote = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.getSingleQuote(quoteId);
    res
      .status(HttpCodes.Ok)
      .json({
        success: true,
        message: "Quote fetched successfully",
        data: quote,
      });
  };

  updateQuoteById = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const {body} = req;
    if(req.file){
      body.bidSheet = req.file.fileUrl;
    }
    logger.info({body},"QuoteController.updateQuoteById")
    const quote = await this.quoteService.updateQuoteById(quoteId, body);
    res.status(HttpCodes.Ok).json({ quote });
  };

  deleteQuoteById = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.deleteQuoteById(quoteId);
    res.status(HttpCodes.Ok).json({ quote });
  };
}
