const mongoose = require("mongoose");

const orderModel = new mongoose.Schema(
    {
        arrivalId: String,
        item: [{ type: mongoose.Types.ObjectId, ref: "OutletMenu" }],
        table: String,
        status: {
            type: String,
            enum: ["active", "done"],
        },
        outlet: { type: mongoose.Types.ObjectId, ref: "Outlet" },
    },
    { timestamps: true }
);
orderModel.index({ createdAt: 1 });

module.exports = mongoose.model("Order", orderModel);
