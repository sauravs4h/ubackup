const mongoose = require("mongoose");

const outletMenuModel = new mongoose.Schema(
    {
        outletId: String,
        name: String,
        bio: String,
        image: [String],
        price: Number,
        menuTitleTags: [String],
        rating: {
            average: {
                type: Number,
                default: 0.0,
            },
            numberOfReviews: {
                type: Number,
                default: 0,
            },
        },
        nonVeg: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        earlyBird: { type: Boolean, default: false },
    },
    { timestamps: true }
);
outletMenuModel.index({ createdAt: 1 });

module.exports = mongoose.model("OutletMenu", outletMenuModel);
