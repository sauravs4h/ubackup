const mongoose = require("mongoose");

const OfferNotification = new mongoose.Schema(
    {
        sentBy: String,
        userId: String,
        room: String,
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
        superOffer: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
OfferNotification.index({ createdAt: 1 });
module.exports = mongoose.model("OfferNotification", OfferNotification);
