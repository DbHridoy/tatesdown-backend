import { updateQuoteDetails } from "./quote.interface";
import Quote from "./quote.model";

export class QuoteRepository {
  createQuote = async (quoteInfo: object) => {
    const newQuote = new Quote(quoteInfo);
    return newQuote.save();
  };

  getAllQuotes = async () => {
    return await Quote.find();
  };

  getSingleQuote = async (id: string) => {
    return await Quote.findById(id).populate("clientId");
  };

  updateQuoteById = async (id: string, quoteInfo: updateQuoteDetails) => {
    return await Quote.findByIdAndUpdate(id, quoteInfo, { new: true });
  };
  deleteQuoteById = async (id: string) => {
    return await Quote.findByIdAndDelete(id);
  };
}
