import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { QuoteRepository } from "./quote.repository";
import { ClientRepository } from "../client/client.repository";
import { createNotificationsForRole } from "../../utils/create-notification-utils";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";

export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly salesRepRepo: SalesRepRepository,
    private readonly clientRepo: ClientRepository
  ) { }

  createQuote = async (
    quoteInfo: any,
    user: any,
    bidSheet?: string
  ) => {



    const salesRep = await this.salesRepRepo.findByUserId(user.userId);

    if (!salesRep) {
      throw new Error("Sales rep profile not found");
    }



    const quote = {
      ...quoteInfo,
      ...(bidSheet ? { bidSheetUrl: bidSheet } : {}),
      salesRepId: user.userId
    };

    const newQuote = await this.quoteRepository.createQuote(quote);
    const quoteNote = {
      clientId: quoteInfo.clientId,
      quoteId: newQuote._id,
      note: quoteInfo.notes || "",
      createdBy: user.userId,
    }
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
    const existingQuote = await this.quoteRepository.getQuoteById(id);
    if (!existingQuote) {
      throw new apiError(Errors.NotFound.code, Errors.NotFound.message);
    }
    if (!user) {
      throw new apiError(Errors.Unauthorized.code, Errors.Unauthorized.message);
    }
    const isAdmin = user.role === "Admin";
    const isAssignedSalesRep =
      user.role === "Sales Rep" &&
      existingQuote.salesRepId?.toString() === user.userId?.toString();
    if (!isAdmin && !isAssignedSalesRep) {
      throw new apiError(Errors.Forbidden.code, Errors.Forbidden.message);
    }

    const { bidSheet, ...updateInfo } = quoteInfo || {};
    const finalUpdateInfo = {
      ...updateInfo,
      ...(bidSheetUrl ? { bidSheetUrl } : {}),
    };
    const updatedQuote = await this.quoteRepository.updateQuoteById(
      id,
      finalUpdateInfo
    );
    if (!bidSheetUrl) {
      return updatedQuote;
    }

    return this.quoteRepository.getQuoteById(id);
  };

  deleteQuoteById = async (id: string) => {
    return await this.quoteRepository.deleteQuoteById(id);
  };
}
