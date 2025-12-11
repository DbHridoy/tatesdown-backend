import { model, Schema, Types } from "mongoose";

const SalesRepSchema=new Schema({
    userId:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    }
})


const SalesRep=model("Salesrep",SalesRepSchema)


export default SalesRep
