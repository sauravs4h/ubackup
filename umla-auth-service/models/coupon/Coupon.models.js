const mongoose = require("mongoose");

const couponModel = new mongoose.Schema(
    {
        offer: { type: mongoose.Types.ObjectId, ref: "Offer" },
        item: { type: mongoose.Types.ObjectId, ref: "OutletMenu" },
        outlet: { type: mongoose.Types.ObjectId, ref: "Outlet" },
        time: String,
        owner: { type: mongoose.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: ["consumed", "active", "claimable", "expired", "actionNeed"],
        },
        meetingWith: { type: mongoose.Types.ObjectId, ref: "User" },
        timeDate: Date,
    },
    { timestamps: true }
);
couponModel.index({ createdAt: 1 });

couponModel.pre("save", async function (next) {
    try {
        const coupon = this;
        coupon.timeDate = new Date(coupon.time);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Coupon", couponModel);

// const newDate = new Date(
//     "Wed Nov 15 2023 13:00:00 GMT+0000 (Coordinated Universal Time)"
// );
// console.log(newDate);
// const newDate1 = new Date();
// // Get the current hours and minutes
// let hours = newDate1.getHours();
// let minutes = newDate1.getMinutes();

// // Add 5 hours and 30 minutes
// hours += 5;
// minutes += 30;

// // If minutes is 60 or more, add 1 to hours and subtract 60 from minutes
// if (minutes >= 60) {
//     hours++;
//     minutes -= 60;
// }

// // Set the new hours and minutes
// newDate1.setHours(hours);
// newDate1.setMinutes(minutes);
// console.log(newDate1);
// console.log(newDate1 > newDate);
