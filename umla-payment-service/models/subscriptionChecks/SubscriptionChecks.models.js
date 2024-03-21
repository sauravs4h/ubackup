const mongoose = require("mongoose");

const subscriptionChecksModel = new mongoose.Schema(
    {
        uid: String,
        profileLimit: { type: Boolean, default: false },
        profileCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);
subscriptionChecksModel.index({ createdAt: 1 });
module.exports = mongoose.model("SubscriptionChecks", subscriptionChecksModel);
