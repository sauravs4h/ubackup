const mongoose = require("mongoose");

const userPromptModel = new mongoose.Schema(
    {
        userId: String,
        prompt: {
            type: mongoose.Types.ObjectId,
            ref: "Prompt",
        },
        answer: String,
    },
    { timestamps: true }
);
userPromptModel.index({ createdAt: 1 });
module.exports = mongoose.model("UserPrompt", userPromptModel);
