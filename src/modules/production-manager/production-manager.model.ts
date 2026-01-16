import { Schema, Types, model } from "mongoose";

const productionManagerSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    cluster: String,

    totalSold: { type: Number, default: 0 },
    totalClients: { type: Number, default: 0 },
    totalQuotes: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    totalDc: { type: Number, default: 0 },
    commissionEarned: { type: Number, default: 0 },
    commissionPending: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalProducedRevenue: { type: Number, default: 0 },
});

const ProductionManager = model("ProductionManager", productionManagerSchema);

export default ProductionManager;
