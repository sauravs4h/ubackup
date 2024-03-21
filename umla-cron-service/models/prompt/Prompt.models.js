const mongoose = require("mongoose");

const promptModel = new mongoose.Schema(
    {
        tag: String,
        question: String,
    },
    { timestamps: true }
);
promptModel.index({ createdAt: 1 });
module.exports = mongoose.model("Prompt", promptModel);
