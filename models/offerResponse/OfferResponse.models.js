const mongoose = require("mongoose");

const offerResponse = new mongoose.Schema(
    {
        offerId: String,
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);
offerResponse.index({ createdAt: 1 });

module.exports = mongoose.model("OfferResponse", offerResponse);
