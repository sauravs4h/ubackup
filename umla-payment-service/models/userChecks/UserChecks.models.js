const mongoose = require("mongoose");

const userChecksModel = new mongoose.Schema(
    {
        uid: String,
        freeOffer: { type: Boolean, default: false },
        offerDenied: { type: Boolean, default: false },
        offerId: String,
        floatCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);
userChecksModel.index({ createdAt: 1 });

module.exports = mongoose.model("UserCheck", userChecksModel);
