const mongoose = require("mongoose");

const roomModel = new mongoose.Schema(
    {
        firstUser: {
            userId: String,
            name: String,
            image: String,
            coupon: {
                type: mongoose.Types.ObjectId,
                ref: "Coupon",
            },
        },
        secondUser: {
            userId: String,
            name: String,
            image: String,
            coupon: {
                type: mongoose.Types.ObjectId,
                ref: "Coupon",
            },
        },
        lastMessage: {
            message: {
                type: String,
                default: "",
            },

            time: {
                type: Date,
                default: "",
            },
        },
        offer: {
            type: mongoose.Types.ObjectId,
            ref: "Offer",
        },
        offerStatus: {
            type: String,
            enum: ["pending", "accepted", "declined", "shared"],
        },
        blocked: { type: Boolean, default: false },
        superOffer: { type: Boolean, default: false },
    },
    { timestamps: true }
);

roomModel.index({ updatedAt: 1 });
roomModel.index({ createdAt: 1 });

module.exports = mongoose.model("Room", roomModel);
