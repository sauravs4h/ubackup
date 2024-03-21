const mongoose = require("mongoose");
const axios = require("axios");
const cron = require("node-cron");
const { sendPushNotification } = require("../../utils/notification.utils");
const Offer = require("../offer/Offer.models");
const User = require("../user/User.models");

const refundModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        offerId: {
            type: mongoose.Types.ObjectId,
            ref: "Offer",
        },
        accountHolderName: String,
        AccountNumber: String,
        ifscCode: String,
        amount: Number,
        status: String,
        txnNumber: String,
    },
    { timestamps: true }
);
refundModel.index({ createdAt: 1 });

refundModel.pre("save", async function (next) {
    // Check if document is new or if status has been modified
    let task;
    const user = await User.findById(this.userId);
    if (this.isNew || this.isModified("status")) {
        switch (this.status) {
            case "pending":
                // Perform action for pending status
                console.log("Status is set to pending");
                task = cron.schedule("*/1 * * * *", async () => {
                    try {
                        const response = await axios.get(
                            `${process.env.self}/api/v1/umla/payment/checkStatus/refund?transactionId=${this.txnNumber}`
                        );
                        const responseData = response.data;
                        if (responseData.code === "PAYMENT_SUCCESS") {
                            task.stop();
                        }
                        if (
                            responseData.code === "PAYMENT_ERROR" ||
                            responseData.code === "PAYMENT_DECLINED" ||
                            responseData.code === "TIMED_OUT"
                        ) {
                            task.stop();
                        }
                    } catch (err) {
                        console.log(err);
                    }
                });
                task.start();
                break;
            case "success":
                console.log("Status is set to success");
                if (task) {
                    task.stop();
                }

                await sendPushNotification(
                    user.deviceId,
                    "Refund completed",
                    "Your refund has been completed"
                );
                break;
            case "failed":
                // Perform action for failed status
                console.log("Status is set to failed");
                if (task) {
                    task.stop();
                }
                const offer = await Offer.findById(this.offerId);
                offer.status = "archived";
                await offer.save();

                await sendPushNotification(
                    user.deviceId,
                    "Refund failed",
                    "Please try again"
                );
                break;
            default:
                console.log("No valid status provided");
        }
    }

    next();
});

module.exports = mongoose.model("Refund", refundModel);
