const mongoose = require("mongoose");
const axios = require("axios");
const cron = require("node-cron");
const { sendPushNotification } = require("../../utils/notification.utils");
const Offer = require("../offer/Offer.models");
const OfferInvoice = require("../offerInvoice/OfferInvoice.models");
const Subscription = require("../subscription/Subscription.models");
const UserSubscription = require("../userSubscription/UserSubscription.models");
const SubscriptionInvoice = require("../subscriptionInvoice/SubscriptionInvoice.models");
const User = require("../user/User.models");

const ledgerSchemaModel = new mongoose.Schema(
    {
        txnNumber: String,
        orderId: String, //(cf_order_id)
        amount: Number,
        status: {
            type: String,
            enum: ["success", "pending", "failed"],
        },
        userId: String,
        desc: {
            type: String,
            enum: ["subscription", "offer"],
        },
        offerId: String,
        subscriptionId: String,
        paymentMode: String,
    },
    { timestamps: true }
);

ledgerSchemaModel.index({ createdAt: 1 });

// write a pre save to check if status is updated and give 3 cases for status
ledgerSchemaModel.pre("save", async function (next) {
    // Check if document is new or if status has been modified
    let task;
    if (this.isNew || this.isModified("status")) {
        switch (this.status) {
            case "pending":
                // Perform action for pending status
                console.log("Status is set to pending");
                task = cron.schedule("*/1 * * * *", async () => {
                    try {
                        const response = await axios.get(
                            `${process.env.self}/api/v1/umla/payment/checkStatus?transactionId=${this.txnNumber}`
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
                const user = await User.findById(this.userId);
                if (this.offerId) {
                    const offer = await Offer.findById(this.offerId);
                    offer.billStatus = "success";
                    const invoice = await OfferInvoice.create({
                        invoiceNumber: this.txnNumber,
                        customerName: offer.name,
                        userId: offer.owner,
                        outletId: offer.outlet,
                        totalAmount: offer.bill.total,
                    });
                    if (offer.guest) {
                        offer.status = "shared";
                        await splitOffer(offer._id);
                    } else {
                        offer.status = "archived";
                    }
                    await offer.save();
                    await sendPushNotification(
                        user.deviceId,
                        "Offer created",
                        "Check your deals for more information"
                    );
                    await offer.save();
                }
                if (this.subscriptionId) {
                    const subscription = await Subscription.findById(
                        this.subscriptionId
                    );

                    const validTill = new Date();
                    validTill.setDate(
                        validTill.getDate() + subscription.validity
                    );
                    const newSubscription = new UserSubscription({
                        name: subscription.name,
                        userId: user._id,
                        validity: {
                            till: validTill,
                            validity: subscription.validity,
                        },
                        price: subscription.price,
                    });
                    user.subscription = true;
                    await newSubscription.save();

                    const invoice = await SubscriptionInvoice.create({
                        invoiceNumber: this.txnNumber,
                        customerNumber: user.name,
                        userId: user._id,
                        items: [
                            {
                                name: subscription.name,
                                quantity: 1,
                                validity: subscription.validity,
                                price: subscription.price,
                            },
                        ],
                        totalAmount: subscription.price,
                    });
                    await sendPushNotification(
                        user.deviceId,
                        "Congratulation",
                        "Enjoy to Umla Plus benefits"
                    );
                }
                await user.save();
                break;
            case "failed":
                // Perform action for failed status
                console.log("Status is set to failed");
                if (task) {
                    task.stop();
                }
                if (this.offerId) {
                    const offer = await Offer.findById(this.offerId);
                    offer.billStatus = "failed";
                    await offer.save();
                }
                break;
            default:
                console.log("No valid status provided");
        }
    }

    next();
});

module.exports = mongoose.model("Ledger", ledgerSchemaModel);
