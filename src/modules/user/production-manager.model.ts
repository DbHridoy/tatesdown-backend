import { Schema, Types, model } from "mongoose";

const productionManagerSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    cluster: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
});

const ProductionManager = model("ProductionManager", productionManagerSchema);

export default ProductionManager;
