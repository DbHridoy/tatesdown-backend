import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
import { updateQuoteDetails } from "./quote.interface";
import { Quote } from "./quote.model";

export class QuoteRepository {
  createQuote = async (quoteInfo: object) => {
    const newQuote = new Quote(quoteInfo);
    return newQuote.save();
  };

  getAllQuotes = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Quote, query);
    return await Quote.find({ ...filter, ...search }, null, options).populate(
      "clientId salesRepId"
    );
  };

  getSingleQuote = async (id: string) => {
    return await Quote.findById(id).populate("clientId salesRepId");
  };

  updateQuoteById = async (id: string, quoteInfo: updateQuoteDetails) => {
    return await Quote.findByIdAndUpdate(id, quoteInfo, { new: true });
  };
  deleteQuoteById = async (id: string) => {
    return await Quote.findByIdAndDelete(id);
  };
}
