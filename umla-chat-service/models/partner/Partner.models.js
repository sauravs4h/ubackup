const mongoose = require("mongoose");

const partnerModel = new mongoose.Schema(
    {
        name: String,
        bio: String,
        pAdminId: String,
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
        tags: [String],
        image: [String],
        outlets: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Outlet",
            },
        ],
    },
    { timestamps: true }
);
partnerModel.index({ createdAt: 1 });
module.exports = mongoose.model("Partner", partnerModel);
