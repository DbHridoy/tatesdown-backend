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
    let salesRepId: Types.ObjectId | undefined;
    const clientId = quoteInfo.clientId;



    const salesRep = await this.salesRepRepo.findByUserId(user.userId);

    if (!salesRep) {
      throw new Error("Sales rep profile not found");
    }

    salesRepId = salesRep._id;

    const quote = {
      ...quoteInfo,
      salesRepId
    };

    const newQuote = await this.quoteRepository.createQuote(quote);
    const finalBitSheet = {
      createdBy: user.userId,
      clientId: clientId,
      bidSheetUrl: bidSheet,
      quoteId: newQuote._id,
    }
    const quoteNote = {
      clientId: clientId,
      quoteId: newQuote._id,
      note: quoteInfo.notes || "",
      createdBy: user.userId,
    }
    await this.quoteRepository.createBidSheet(finalBitSheet);
    await this.clientRepo.createClientNote(quoteNote);
    if (salesRepId) {
      await this.salesRepRepo.incrementSalesRepStats('quote', salesRepId);
    }
    await this.clientRepo.updateLeadStatus(
      newQuote.clientId.toString(),
      "Quoted"
    );
    return newQuote;
  };

  getAllQuote = async (query: any) => {
    const quoteData = await this.quoteRepository.getAllQuotes(query);
    // const formattedQuotes=quoteData.map((quote)=>{
    //     return {

    //     }
    // })
    // return formattedQuotes
    return quoteData;
  };

  getSingleQuote = async (id: string) => {
    return await this.quoteRepository.getSingleQuote(id);
  };

  updateQuoteById = async (id: string, quoteInfo: object) => {
    return await this.quoteRepository.updateQuoteById(id, quoteInfo);
  };
  deleteQuoteById = async (id: string) => {
    return await this.quoteRepository.deleteQuoteById(id);
  };
}
