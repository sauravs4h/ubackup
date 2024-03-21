const mongoose = require("mongoose");

const userSubscriptionSchemaModel = new mongoose.Schema(
    {
        name: String,
        userId: String,
        validity: {
            till: Date,
            days: Number,
        },
        price: Number,
    },
    { timestamps: true }
);
userSubscriptionSchemaModel.index({ createdAt: 1 });
module.exports = mongoose.model(
    "UserSubscription",
    userSubscriptionSchemaModel
);
