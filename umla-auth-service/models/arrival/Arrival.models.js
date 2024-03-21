const mongoose = require("mongoose");

const arrivalMOdel = new mongoose.Schema(
    {
        offer: { type: mongoose.Types.ObjectId, ref: "Offer" },
        guest: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        time: Date,
        table: { type: String, default: "unassigned" },
        status: {
            type: String,
            enum: ["upcoming", "active", "done", "expired"],
        },
        outlet: { type: mongoose.Types.ObjectId, ref: "Outlet" },
        alert: {
            type: Boolean,
            default: false,
        },
        alertReason: {
            type: String,
        },
        alertResolution: {
            type: String,
        },
        arrivalTime: Date,
    },
    { timestamps: true }
);
arrivalMOdel.index({ createdAt: 1 });
module.exports = mongoose.model("Arrival", arrivalMOdel);
