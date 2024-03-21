const mongoose = require("mongoose");

const partnerAdminSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
    },
    { timestamps: true }
);
partnerAdminSchema.index({ createdAt: 1 });

module.exports = mongoose.model("PartnerAdmin", partnerAdminSchema);
