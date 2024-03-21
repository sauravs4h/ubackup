const mongoose = require("mongoose");

const UserReferralModel = new mongoose.Schema(
    {
        userId: String,
        referralCode: String,
        referredTo: {
            male: [String],
            female: [String],
        },
        referredBy: String,
        referralReward: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);
UserReferralModel.index({ createdAt: 1 });
module.exports = mongoose.model("UserReferral", UserReferralModel);
