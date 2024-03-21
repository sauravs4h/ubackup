const mongoose = require("mongoose");

const outletMenuRatingModel = new mongoose.Schema(
    {
        mid: String,
        rating: Number,
        image: [String],
        review: String,
    },
    { timestamps: true }
);
outletMenuRatingModel.index({ createdAt: 1 });

module.exports = mongoose.model("OutletMenuRating", outletMenuRatingModel);
