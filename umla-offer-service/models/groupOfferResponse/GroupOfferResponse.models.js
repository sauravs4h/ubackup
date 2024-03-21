const mongoose = require("mongoose");

const groupOfferResponse = new mongoose.Schema(
    {
        groupOfferId: String,
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);
groupOfferResponse.index({ createdAt: 1 });

module.exports = mongoose.model("GroupOfferResponse", groupOfferResponse);
