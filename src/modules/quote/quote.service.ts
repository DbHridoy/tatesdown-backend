import { Types } from "mongoose";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { QuoteRepository } from "./quote.repository";
import { ClientRepository } from "../client/client.repository";

export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly salesRepRepo: SalesRepRepository,
    private readonly clientRepo: ClientRepository
  ) { }

  createQuote = async (
    quoteInfo: any,
    bidSheet: string,
    user: any
  ) => {



    const salesRep = await this.salesRepRepo.findByUserId(user.userId);

    if (!salesRep) {
      throw new Error("Sales rep profile not found");
    }



    const quote = {
      ...quoteInfo,
      salesRepId: user.userId
    };

    const newQuote = await this.quoteRepository.createQuote(quote);
    const finalBitSheet = {
      createdBy: user.userId,
      clientId: quoteInfo.clientId,
      bidSheetUrl: bidSheet,
      quoteId: newQuote._id,
    }
    const quoteNote = {
      clientId: quoteInfo.clientId,
      quoteId: newQuote._id,
      note: quoteInfo.notes || "",
      createdBy: user.userId,
    }
    await this.quoteRepository.createBidSheet(finalBitSheet);
    await this.clientRepo.createClientNote(quoteNote);
    if (user.userId) {
      await this.salesRepRepo.incrementSalesRepStats('quote', user.userId);
    }
    await this.clientRepo.updateLeadStatus(
      newQuote.clientId.toString(),
      "Quoted"
    );
    return newQuote;
  };

  getAllQuote = async (query: any) => {
    const quoteData = await this.quoteRepository.getAllQuotes(query);
    return quoteData;
  };

  getQuoteById = async (id: string) => {
    return await this.quoteRepository.getQuoteById(id);
  };

  updateQuoteById = async (id: string, quoteInfo: object) => {
    return await this.quoteRepository.updateQuoteById(id, quoteInfo);
  };

  deleteQuoteById = async (id: string) => {
    return await this.quoteRepository.deleteQuoteById(id);
  };
}
