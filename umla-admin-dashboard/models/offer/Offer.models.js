const mongoose = require("mongoose");
const Outlet = require("../outlet/Outlet.models");
const { Offer } = require("../index.models");

const offerModel = new mongoose.Schema(
    {
        owner: { type: mongoose.Types.ObjectId, ref: "User" },
        guest: { type: mongoose.Types.ObjectId, ref: "User" },
        time: String,
        offering: String,
        purpose: String,
        status: {
            type: String,
            enum: [
                "active",
                "floating",
                "shared",
                "consumed",
                "expired",
                "archived",
                "refunded",
                "paymentPending",
                "actionNeed",
            ],
        },
        outlet: {
            type: mongoose.Types.ObjectId,
            ref: "Outlet",
        },
        loc: {
            type: {
                type: String,
                default: "Point",
            },
            coordinates: {
                type: [Number],
            },
        },
        orderDetails: {
            forMe: {
                item: { type: mongoose.Types.ObjectId, ref: "OutletMenu" },
            },
            forYou: {
                item: { type: mongoose.Types.ObjectId, ref: "OutletMenu" },
            },
        },
        bill: {
            itemTotal: Number,
            tax: Number,
            platformCharge: Number,
            total: Number,
        },
        billStatus: {
            type: String,
            enum: ["success", "failed", "pending"],
        },
        arrivalStatus: {
            host: {
                type: Boolean,
                default: false,
            },
            guest: {
                type: Boolean,
                default: false,
            },
        },
        responseCount: { type: Number, default: 0 },
        offerType: {
            type: String,
            enum: ["scheduled", "instant"],
        },
        earlyBird: { type: Boolean, default: false },
        timeDate: Date,
    },
    { timestamps: true }
);

offerModel.pre("save", async function (next) {
    try {
        const offer = this;
        const outlet = await Outlet.findById(offer.outlet);
        if (outlet) {
            offer.loc = outlet.loc;
        }
        offer.timeDate = new Date(offer.time);

        // Convert bill values to double with 2 decimal places
        if (offer.bill.itemTotal) {
            offer.bill.itemTotal = parseFloat(offer.bill.itemTotal.toFixed(2));
        }
        if (offer.bill.tax) {
            offer.bill.tax = parseFloat(offer.bill.tax.toFixed(2));
        }
        if (offer.bill.total) {
            offer.bill.total = parseFloat(offer.bill.total.toFixed(2));
        }
        // // Check if billStatus has changed to pending
        // if (this.isModified("billStatus") && this.billStatus === "pending") {
        //     // Start a function that checks if the bill status is still pending after 10 min
        //     setTimeout(async () => {
        //         const updatedOffer = await Offer.findById(offer._id);
        //         if (updatedOffer.billStatus === "pending") {
        //             console.log(
        //                 "Bill status is still pending after 10 minutes"
        //             );

        //             // You can add more actions her
        //             // Remove the billStatus key
        //             updatedOffer.billStatus = undefined;
        //             await updatedOffer.save();
        //         }
        //     }, 10 * 60 * 1000); // 10 minutes
        // }
        next();
    } catch (err) {
        next(err);
    }
});
offerModel.index({ createdAt: 1 });

module.exports = mongoose.model("Offer", offerModel);
