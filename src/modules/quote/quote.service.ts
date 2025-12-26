import { quoteDetails, updateQuoteDetails } from "./quote.interface";
import { QuoteRepository } from "./quote.repository";

export class QuoteService{
    constructor(private readonly quoteRepository:QuoteRepository){}

    createQuote=async (quoteInfo:quoteDetails)=>{
        return await this.quoteRepository.createQuote(quoteInfo)
    }

    getAllQuote= async (query:any)=>{
        const quoteData =await this.quoteRepository.getAllQuotes(query)
        // const formattedQuotes=quoteData.map((quote)=>{
        //     return {
                
        //     }
        // })
        // return formattedQuotes
        return quoteData
    }

    getSingleQuote=async (id:string)=>{
        return await this.quoteRepository.getSingleQuote(id)
    }

    updateQuoteById=async (id:string,quoteInfo:updateQuoteDetails)=>{
        return await this.quoteRepository.updateQuoteById(id,quoteInfo)
    }
    deleteQuoteById=async (id:string)=>{
        return await this.quoteRepository.deleteQuoteById(id)
    }
}