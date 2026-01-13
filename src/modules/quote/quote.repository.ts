import { populate } from "dotenv";
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
    const [quote, total] = await Promise.all([
      Quote.find({ ...filter, ...search }, null, options).populate({
        path: "clientId",
        populate:{
          path:"salesRepId"
        },
      }),
      Quote.countDocuments({ ...filter, ...search }),
    ]);
    return { quote, total };
  };

  getSingleQuote = async (id: string) => {
    return await Quote.findById(id).populate({
      path:"clientId",
      populate:{
        path:"salesRepId"
      }
    });
  };

  updateQuoteById = async (id: string, quoteInfo: updateQuoteDetails) => {
    return await Quote.findByIdAndUpdate(id, quoteInfo, { new: true });
  };


  updateQuoteStatus = async (id: string, status: string) => {
    return await Quote.findByIdAndUpdate(id, { status }, { new: true });
  }
  
  deleteQuoteById = async (id: string) => {
    return await Quote.findByIdAndDelete(id);
  };
}
