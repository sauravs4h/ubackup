const mongoose = require("mongoose");

const reportMOdel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        reportedUserId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        reportReason: String,
    },
    { timestamps: true }
);
reportMOdel.index({ createdAt: 1 });
module.exports = mongoose.model("Report", reportMOdel);
