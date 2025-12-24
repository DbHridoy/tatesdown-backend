import { buildDynamicSearch } from "../../utils/dynamic-search-utils";
import { Quote } from "./quote.model";
import { logger } from "../../utils/logger";

export class QuoteRepository {
  createQuote = async (quoteInfo: object) => {
    logger.info({ quoteInfo }, "QuoteRepository.createQuote");
    const newQuote = new Quote(quoteInfo);
    return newQuote.save();
  };

  getAllQuotes = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Quote, query);
    return await Quote.find({ ...filter, ...search }, null, options);
  };

  getSingleQuote = async (id: string) => {
    return await Quote.findById(id);
  };

  updateQuoteById = async (id: string, quoteInfo: any) => {
    const updateQuery: any = {};
    logger.info({ quoteInfo }, "QuoteRepository.updateQuoteById");

    // normal fields
    const { notes, ...rest } = quoteInfo;

    if (Object.keys(rest).length) {
      updateQuery.$set = rest;
    }
    
    if (!Object.keys(updateQuery).length) {
      throw new Error("No valid fields provided for update");
    }

    // append notes
    if (notes?.length) {
      updateQuery.$push = {
        notes: { $each: notes },
      };
    }

    const updatedQuote = await Quote.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuote) {
      throw new Error("Quote not found");
    }

    return updatedQuote;
  };

  deleteQuoteById = async (id: string) => {
    return await Quote.findByIdAndDelete(id);
  };
}
