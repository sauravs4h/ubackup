const mongoose = require("mongoose");

const SubscriptionSchemaModel = new mongoose.Schema(
    {
        name: String,
        validity: Number,
        price: Number,
        originalPrice: Number,
    },
    { timestamps: true }
);
SubscriptionSchemaModel.index({ createdAt: 1 });
module.exports = mongoose.model("Subscription", SubscriptionSchemaModel);
