import { model, Schema, Types } from "mongoose";

const ProductionManagerSchema=new Schema({
    userId:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    }
})


const ProductionManager=model("ProductionManager",ProductionManagerSchema)

export default ProductionManager