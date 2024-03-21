const mongoose = require("mongoose");

const UnmatchModel = new mongoose.Schema(
    {
    userId: String,
    unmatchUserId: String
    
    },
    { timestamps: true }
);
UnmatchModel.index({ createdAt: 1 });
module.exports = mongoose.model("Unmatch", UnmatchModel);
