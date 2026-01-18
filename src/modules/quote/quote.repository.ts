import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
import { Quote } from "./quote.model";
import { BidSheet } from "./bid-sheet.model";

export class QuoteRepository {
  createQuote = async (quoteInfo: object) => {
    const newQuote = new Quote(quoteInfo);
    return newQuote.save();
  };

  createBidSheet = async (bidSheetInfo: object) => {
    const newBidSheet = new BidSheet(bidSheetInfo);
    return newBidSheet.save();
  };

  deleteBidSheetsByQuoteId = async (quoteId: string) => {
    return BidSheet.deleteMany({ quoteId });
  };

  getAllQuotes = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Quote, query);
    const [quote, total] = await Promise.all([
      Quote.find({ ...filter, ...search }, null, options).populate([{
        path: "clientId",
        populate: {
          path: "salesRepId"
        },
      }]),
      Quote.countDocuments({ ...filter, ...search }),
    ]);
    return { quote, total };
  };

  getQuoteById = async (id: string) => {
    return await Quote.findById(id).populate([{
      path: "clientId",
      populate: {
        path: "salesRepId"
      }
    }, {
      path: "bidSheet"
    }, {
      path: "notes"
    }]);
  };

  updateQuoteById = async (id: string, quoteInfo: object) => {
    return await Quote.findByIdAndUpdate(id, quoteInfo, { new: true }).populate(["bidSheet", "notes"]);
  };

  updateQuoteStatus = async (id: string, status: string) => {
    return await Quote.findByIdAndUpdate(id, { status }, { new: true });
  }

  deleteQuoteById = async (id: string) => {
    return await Quote.findByIdAndDelete(id);
  };
}
