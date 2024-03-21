const mongoose = require("mongoose");

const OnboardRequestSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
        },
        category: {
            type: String,
        },
        email: { type: String },
        executiveName: {
            type: String,
        },
        contactNumber: {
            type: String,
        },
        city: {
            type: String,
        },
        openAt: {
            type: String,
        },
        closeAt: {
            type: String,
        },
        address: {
            type: String,
        },
        images: {
            type: [String],
        },
        status: {
            type: String,
            enum: ["Requested", "Accepted", "Rejected"],
            default: "Requested",
        },
    },
    { timestamps: true }
);
OnboardRequestSchema.index({ createdAt: 1 });
module.exports = mongoose.model("OnboardRequest", OnboardRequestSchema);
