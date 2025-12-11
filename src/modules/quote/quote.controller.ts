import { Request, Response, NextFunction } from "express";
import { HttpCodes } from "../../constants/status-codes";
import { QuoteService } from "./quote.service";

export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  createQuote = async (req: Request, res: Response, next: NextFunction) => {
    const quoteInfo = req.body;
    const quote = await this.quoteService.createQuote(quoteInfo);
    res.status(HttpCodes.Ok).json({ quote });
  };
  getAllQuote = async (req: Request, res: Response, next: NextFunction) => {
    const quote = await this.quoteService.getAllQuote();
    res.status(HttpCodes.Ok).json({ quote });
  };
  getSingleQuote = async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.getSingleQuote(quoteId);
    res.status(HttpCodes.Ok).json({ quote });
  };

  updateQuoteById=async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.updateQuoteById(quoteId,req.body);
    res.status(HttpCodes.Ok).json({ quote });
  }

  deleteQuoteById=async (req: Request, res: Response, next: NextFunction) => {
    const { quoteId } = req.params;
    const quote = await this.quoteService.deleteQuoteById(quoteId);
    res.status(HttpCodes.Ok).json({ quote });
  }
}
