const mongoose = require("mongoose");

const preferenceModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        meetupSlot: String,
        offerPreference: String,
        foodPreference: String,
        beveragePreference: String,
        meetingPreference:String
    },
    { timestamps: true }
);
preferenceModel.index({ createdAt: 1 });

module.exports = mongoose.model("OfferPreference", preferenceModel);
