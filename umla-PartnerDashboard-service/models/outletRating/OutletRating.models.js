const mongoose = require("mongoose");

const outletRatingModel = new mongoose.Schema(
    {
        outletId: String,
        rating: Number,
        image: [String],
        review: String,
    },
    { timestamps: true }
);
outletRatingModel.index({ createdAt: 1 });

module.exports = mongoose.model("OutletRating", outletRatingModel);
