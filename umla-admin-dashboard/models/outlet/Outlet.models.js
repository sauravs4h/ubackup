const mongoose = require("mongoose");

const outletModel = new mongoose.Schema(
    {
        pid: String,
        name: String,
        bio: String,
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
        outletTags: [String],
        menuTitle: [String],
        info: {
            image: [String],
            location: String,
            address: String,
            timing: {
                opensAt: String,
                closesAt: String,
                status: {
                    type: String,
                    enum: ["open", "closed", "opening soon", "closing soon"],
                    default: "open",
                },
            },
        },
        loc: {
            type: {
                type: String,
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
        },
        earlyBird: { type: Boolean, default: false },
        couponsLeft: { type: Number, default: 0 },
        managerName: String,
        category: String,
        email: String,
        managerContact: String,
        openAt: String,
        closeAt: String,
        city: String,
        address: String,
        account: {
            accName: String,
            accNo: String,
            bankName: String,
            ifsc: String,
        },
    },
    { timestamps: true }
);
outletModel.index({ loc: "2dsphere" });
outletModel.index({ createdAt: 1 });
module.exports = mongoose.model("Outlet", outletModel);
