import { Types } from "mongoose";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { QuoteRepository } from "./quote.repository";
import { ClientRepository } from "../client/client.repository";
import { createNotificationsForRole } from "../../utils/create-notification-utils";

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
    if (quoteInfo?.notes) {
      await createNotificationsForRole("Admin", {
        type: "note_added",
        message: "A note was added to a quote",
      });
    }
    await createNotificationsForRole("Admin", {
      type: "client_converted_quote",
      message: "A client was converted into a quote",
    });
    return newQuote;
  };

  getAllQuote = async (query: any) => {
    const quoteData = await this.quoteRepository.getAllQuotes(query);
    return quoteData;
  };

  getQuoteById = async (id: string) => {
    return await this.quoteRepository.getQuoteById(id);
  };

  updateQuoteById = async (
    id: string,
    quoteInfo: any,
    bidSheetUrl?: string,
    user?: any
  ) => {
    const { bidSheet, ...updateInfo } = quoteInfo || {};
    const updatedQuote = await this.quoteRepository.updateQuoteById(
      id,
      updateInfo
    );
    if (!bidSheetUrl) {
      return updatedQuote;
    }

    const quote = await this.quoteRepository.getQuoteById(id);
    if (!quote) {
      throw new Error("Quote not found");
    }
    if (!user?.userId) {
      throw new Error("User is required to update bid sheet");
    }

    await this.quoteRepository.deleteBidSheetsByQuoteId(id);
    await this.quoteRepository.createBidSheet({
      createdBy: user.userId,
      clientId: quote.clientId,
      bidSheetUrl,
      quoteId: quote._id,
    });
    return this.quoteRepository.getQuoteById(id);
  };

  deleteQuoteById = async (id: string) => {
    return await this.quoteRepository.deleteQuoteById(id);
  };
}
