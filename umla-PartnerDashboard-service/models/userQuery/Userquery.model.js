const mongoose = require("mongoose");

const UserquerySchemaModel = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["Resolved", "Unresolved"],
            default: "Unresolved",
        },
        title: String,
        description: String,
        resolution: String,
        image: [String],
    },
    { timestamps: true }
);

UserquerySchemaModel.index({ createdAt: 1 });

module.exports = mongoose.model("Userquery", UserquerySchemaModel);
