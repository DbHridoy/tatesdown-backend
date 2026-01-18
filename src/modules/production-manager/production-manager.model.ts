import { Schema, Types, model } from "mongoose";

const productionManagerSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
});

const ProductionManager = model("ProductionManager", productionManagerSchema);

export default ProductionManager;
