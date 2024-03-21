const {
    Chat,
    User,
    Room,
    Swipe,
    Admin,
    Offer,
    Ledger,
    Outlet,
    Partner,
    OutletMenu,
    OutletRating,
    PartnerAdmin,
    Subscription,
    OfferInvoice,
    UserSubscription,
    OutletMenuRating,
    SubscriptionInvoice,
    Refund,
} = require("../../models/index.models");
const { splitOffer } = require("../../utils/handleOffer.utils");
const { sendMailToAdmin,} = require("../../utils/helper/helperFunc.utils");
const { sendPushNotification } = require("../../utils/notification.utils");
const axios = require("axios");
// const NodeRSA = require('node-rsa');
require("dotenv").config();
const crypto = require("crypto");

const generateTransactionNumber = (userId) => {
    const timestamp = Date.now();
    return `${timestamp}${userId}`;
};

const createOrder = async (req, res) => {
    const { offerId, subscriptionId } = req.body;
    const userId = req.user.id;
    try {
        let data, txnTypeCheck;
        if (offerId) {
            data = await Offer.findById(offerId);
            txnTypeCheck = true;
        } else if (subscriptionId) {
            data = await Subscription.findById(subscriptionId);
            txnTypeCheck = false;
        }
        const user = await User.findById(userId).select("contactNumber");
        const transactionId = generateTransactionNumber(userId);
        const options = {
            method: "POST",
            url: "https://api.cashfree.com/pg/orders",
            headers: {
                accept: "application/json",
                "x-client-id": process.env.x_client_id,
                "x-client-secret": process.env.x_client_secret,
                "x-api-version": "2022-09-01",
                "content-type": "application/json",
            },
            data: {
                customer_details: {
                    customer_id: userId,
                    customer_phone: user.contactNumber,
                },
                order_amount: txnTypeCheck ? data.bill.total : data.price,
                order_id: transactionId,
                order_currency: "INR",
            },
        };
        // const response = await axios.request(options);
        // const responseData = response.data;
        const ledgerData = {
            txnNumber: transactionId,
            // orderId: responseData.cf_order_id,
            orderId: transactionId,
            // amount: responseData.order_amount,
            amount: txnTypeCheck ? data.bill.total : data.price,
            userId,
            desc: txnTypeCheck ? "offer" : "subscription",
        };
        ledgerData[`${txnTypeCheck ? "offerId" : "subscriptionId"}`] = data._id;
        await Ledger.create(ledgerData);
        // res.status(200).json({
        //     cf_order_id: responseData.cf_order_id,
        //     order_id: responseData.order_id,
        //     payment_session_id: responseData.payment_session_id,
        //     payments: responseData.payments,
        // });
        res.status(200).json({ cf_order_id: transactionId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

//! need to revisit this as we are going to use different 3rd party gateway
const confirmOrder = async (req, res) => {
    const userId = req.user.id;
    const { status, cf_order_id } = req.body;

    try {
        const ledger = await Ledger.findOne({ orderId: cf_order_id });
        const user = await User.findById(userId);
        if (!ledger) {
            return res.status(400).json({ message: "Invalid/incomplete data" });
        }
        // const options = {
        //     method: "GET",
        //     url: `https://api.cashfree.com/pg/orders/${ledger.orderId}/payments`,
        //     headers: {
        //         accept: "application/json",
        //         "x-client-id": process.env.x_client_id,
        //         "x-client-secret": process.env.x_client_secret,
        //         "x-api-version": "2022-09-01",
        //     },
        // };
        // const response = await axios.request(options);

        if (ledger.subscriptionId) {
            // SUBSCRIPTION
            const subscription = await Subscription.findById(
                ledger.subscriptionId
            );
            if (
                status === "cancelled"
                // || response.data.length < 1
            ) {
                // FAILED
                ledger.status = "failed";
                await ledger.save();
                ledger.status = "failed";
                await ledger.save();
                return res.status(200).json({ message: "transaction failed" });
                // --------------------------------------- //
            } else if (
                // SUCCESS
                status === "success"
                // && response.data[0].payment_status === "SUCCESS"
            ) {
                const validTill = new Date();
                validTill.setDate(validTill.getDate() + subscription.validity);
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
                await user.save();

                ledger.status = "success";
                await ledger.save();

                const invoice = await SubscriptionInvoice.create({
                    invoiceNumber: ledger.txnNumber,
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
                const response = await sendPushNotification(
                    user.deviceId,
                    "Congratulation",
                    "Enjoy to Umla Plus benefits"
                );
                console.log("response ", response.data.success);
                return res.status(200).json({ message: "success", invoice });
                // --------------------------------------- //
            } else {
                // PENDING
                ledger.status = "pending";
                await ledger.save();
                return res.status(200).json({ message: "transaction pending" });
            }
            // --------------------------------------- //
        } else if (ledger.offerId) {
            // OFFER
            const offer = await Offer.findById(ledger.offerId);
            if (
                status === "cancelled"
                // || response.data.length < 1
            ) {
                // FAILED
                ledger.status = "failed";
                await ledger.save();
                offer.billStatus = "failed";
                await offer.save();
                return res.status(200).json({ message: "transaction failed" });
                // --------------------------------------- //
            } else if (
                // SUCCESS
                status === "success"
                // &&
                // response.data[0].payment_status === "SUCCESS"
            ) {
                offer.billStatus = "success";
                ledger.status = "success";
                await ledger.save();
                const items = []; //! update cases 1: no guest, case 2: guest exist
                // offer.orderDetails.map((item) => {
                // 	items.push({
                // 		name: item.itemName,
                // 		quantity: item.itemCount,
                // 		price: item.totalCost,
                // 	});
                // });
                // const totalPrice = items.reduce((accumulator, item) => {
                // 	return accumulator + item.price;
                // }, 0);

                const invoice = await OfferInvoice.create({
                    invoiceNumber: ledger.txnNumber,
                    customerName: offer.name,
                    userId: offer.owner,
                    outletId: offer.outlet,
                    items,
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
                return res.status(200).json({ message: "success", invoice });
                // --------------------------------------- //
            } else {
                // PENDING
                ledger.status = "pending";
                await ledger.save();
                return res.status(200).json({ message: "transaction pending" });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

// const cashFreeAuth = async () => {
// 	const timestamp = Math.floor(Date.now() / 1000);
// 	const dataToEncrypt = `${process.env.payout_x_client_id}.${timestamp}`;
// 	const publicKey =
// 		'-----BEGIN PUBLIC KEY-----\n' +
// 		'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsraf+xwXMvTDYEwG1GBn\n' +
// 		'rw1wAEjMtfvOUlN4G1MQLNdMWrsqsNKNg7uAVTqlXNFrXcG/mkF6pYu4/jpn02GW\n' +
// 		'bJAtkFMCRyGWVWWQfgLpGB508Q9/jhInvRR4h8qigWkM3MJcbKrFW95CL2GhZCIP\n' +
// 		'JXI9/sOW39Eg0gVp/5543VzKcCL1pELZo8bC/mfM5u16/LS+OS7BHD55SqMo2VFu\n' +
// 		'/Vl24tcBvyGrO0MWU144yPb7d/PS1rOXtHuBRE1a18InJQAKPezaQ/Vk+W12Ozmn\n' +
// 		'ehqhgpMbO8euaXR4FQbHSaipw/x9HVBKZsZrCZI+zwipdN220C6zYvpu5fvsAktw\n' +
// 		'1QIDAQAB\n' +
// 		'-----END PUBLIC KEY-----\n';

// 	const key = new NodeRSA();

// 	key.importKey(publicKey, 'pkcs8-public-pem');

// 	const encryptedData = key.encrypt(dataToEncrypt, 'base64');

// 	const options1 = {
// 		method: 'POST',
// 		url: 'https://payout-api.cashfree.com/payout/v1/authorize',
// 		headers: {
// 			accept: 'application/json',
// 			'X-Cf-Signature': encryptedData,
// 			'X-Client-Secret': process.env.payout_x_client_secret,
// 			'X-Client-Id': process.env.payout_x_client_id,
// 		},
// 	};
// 	const authResponse = await axios.request(options1);
// 	const authResponseData = authResponse.data;
// 	return authResponseData;
// };

const refund = async (req, res) => {
    const userId = req.user.id;
    const { offerId, accountHolderName, AccountNumber, ifscCode } = req.body;
    try {
        const offer = await Offer.findById(offerId);
        offer.status = "refunded";
        await Refund.create({
            userId,
            offerId,
            accountHolderName,
            AccountNumber,
            ifscCode,
            amount: offer.bill.itemTotal,
        });
        await offer.save();
        res.status(200).json({ message: "refund initiated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                          PhonePay Integration
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const payAPI = async (req, res) => {
    const { offerId, subscriptionId } = req.body;
    const userId = req.user.id;
    // const userId = "653f61b2f0664a563543ee12";

    try {
        let data, txnTypeCheck, amount;
        if (offerId) {
            data = await Offer.findById(offerId);
            if (data.billStatus === "pending") {
                return res.status(200).json({
                    message:
                        "payment already initiated, please try again in some time",
                });
            }
            txnTypeCheck = true;
            amount = data.bill.total * 100;
        } else if (subscriptionId) {
            data = await Subscription.findById(subscriptionId);

            txnTypeCheck = false;
            amount = data.price * 100;
        }
        const user = await User.findById(userId).select("contactNumber");
        function removeCountryCode(str) {
            if (str.startsWith("+91")) {
                return str.slice(3);
            } else {
                return str;
            }
        }
        const number = removeCountryCode(user.contactNumber);

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //PAYMENT++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        const transactionId = generateTransactionNumber(userId);
        const payload = {
            merchantId: process.env.merchant_id,
            merchantTransactionId: transactionId,
            merchantUserId: user._id.toString(),
            amount,
            redirectUrl: `https://umla.world/redirectUrl`,
            redirectMode: "REDIRECT",
            callbackUrl: `${process.env.server}/api/v1/umla/payment/callbackUrl`,
            mobileNumber: number,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };
        console.log("payload: ", payload);

        // Convert the payload object to a JSON string
        const jsonString = JSON.stringify(payload);

        // Convert the JSON string to a Buffer
        const buffer = Buffer.from(jsonString);

        // Convert the Buffer to a base64 encoded string
        const base64EncodedPayload = buffer.toString("base64");
        console.log("base64: ", base64EncodedPayload);
        // Your salt key and salt index
        const saltKey = process.env.salt_key; // Replace with your actual salt key
        const saltIndex = process.env.salt_index; // Replace with your actual salt index

        // The string to be hashed
        const str = base64EncodedPayload + "/pg/v1/pay" + saltKey;

        // Create a SHA256 hash of the string
        const hash = crypto.createHash("sha256").update(str).digest("hex");
        // Append the salt index to the hash
        const result = hash + "###" + saltIndex;
        console.log("X-VERIFY: ", result);
        const options = {
            method: "POST",
            url: `${process.env.payment_url}/pg/v1/pay`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": result,
            },
            data: { request: base64EncodedPayload },
        };
       // const response = await axios.request(options);

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //PAYMENT++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
       // const responseData = response.data;
       // console.log(responseData);
        const ledgerData = {
            txnNumber: transactionId,
            orderId: "",
            amount: amount / 100 + 0.0,
            userId,
            desc: txnTypeCheck ? "offer" : "subscription",
            status: "pending",
        };
        ledgerData[`${txnTypeCheck ? "offerId" : "subscriptionId"}`] = data._id;
        await Ledger.create(ledgerData);
        if (txnTypeCheck) {
            data.billStatus = "pending";
            await data.save();
            setTimeout(async () => {
                const updatedOffer = await Offer.findById(data._id);
                if (updatedOffer.billStatus === "pending") {
                    console.log(
                        "Bill status is still pending after 10 minutes"
                    );

                    // You can add more actions her
                    // Remove the billStatus key
                    updatedOffer.billStatus = undefined;
                    await updatedOffer.save();
                }
            }, 10 * 60 * 1000); // 10 minutes
        }
        res.status(200).json({ base64EncodedPayload,result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const redirectUrl = async (req, res) => {};

const callBackUrl = async (req, res) => {
    const { response } = req.body;
    const xVerifyHeader = req.headers["X-VERIFY"];
    try {
        const base64EncodedResponse = response;

        // Your salt key and salt index
        const saltKey = process.env.salt_key; // Replace with your actual salt key
        const saltIndex = process.env.salt_index; // Replace with your actual salt index

        // The string to be hashed
        const str = base64EncodedResponse + "/pg/v1/pay" + saltKey;

        // Create a SHA256 hash of the string
        const hash = crypto.createHash("sha256").update(str).digest("hex");

        // Append the salt index to the hash
        const result = hash + "###" + saltIndex;
        if (!(xVerifyHeader !== result)) {
            return res.status(400).json({ success: false });
        }

        // Create a buffer from the Base64 encoded string
        const buffer = Buffer.from(base64EncodedResponse, "base64");

        // Decode the buffer as UTF-8
        const decodedResponse = buffer.toString("utf8");
        const jsonResponse = JSON.parse(decodedResponse);
        const data = jsonResponse.data;
        const ledger = await Ledger.findOne({
            txnNumber: data.merchantTransactionId,
        });
        const user = await User.findById(ledger.userId);
        // Payment failure
        if (jsonResponse.code === "PAYMENT_ERROR") {
            ledger.orderId = data.transactionId;
            ledger.status = "failed";
        }

        // Payment success
        if (jsonResponse.code === "PAYMENT_SUCCESS") {
            ledger.status = "success";
            ledger.paymentMode = data.paymentInstrument.type;

            // sending mail to admin about success
            if(ledger.desc=="subscription"){
                let userName=user.name;
                let userNumber=user.contactNumber;
                
                let emailSubject="User buy subscription for UMLA"
                let emailBody=`A user with the following details buy subscription  :\n\nName: ${userName}\nNumber: ${userNumber}`;

                await sendMailToAdmin(emailSubject,emailBody);
            }
            if(ledger.desc=="offer"){
                let offerId=ledger.offerId
                let userOffer= await Offer.findOne({_id:offerId})
                               .populate("owner", "_id name")
                               .populate("guest", "_id name")
                               .populate("outlet", "_id name")
                               
                                
                let hostName= userOffer.owner.name;
                let guestName= userOffer.guest?.name;
                let time= userOffer.time;
                let cafe=userOffer.outlet.name
                

                let emailSubject="User make new meetup in UMLA"

                let emailBody=`A user with the following details make a new meetup :\n\nHost name: ${hostName}\nGust name: ${guestName}\nvenue: ${cafe} \n time: ${time} `;

                await sendMailToAdmin(emailSubject,emailBody);


               
            }
        }
        // await user.save();
        await ledger.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const refundApi = async (req, res) => {
    const { offerId } = req.body;
    const userId = req.user.id;
    try {
        const offer = await Offer.findById(offerId);
        const ledger = await Ledger.findOne({ offerId });
        offer.status = "refunded";
        let refundAmount = 1;
        if (ledger.amount > 30) {
            refundAmount = ledger.amount - 30;
        }
        const payload = {
            merchantId: process.env.merchant_id,
            merchantUserId: userId,
            originalTransactionId: ledger.txnNumber,
            merchantTransactionId: "R" + ledger.txnNumber,
            amount: refundAmount * 100,
            callbackUrl: `${process.env.server}/api/v1/umla/payment/callbackUrl/refund`,
        };
        console.log("payload", payload);
        await Refund.create({
            userId,
            offerId,
            amount: payload.amount / 100,
            status: "pending",
            txnNumber: "R" + ledger.txnNumber,
        });
        // Convert the payload object to a JSON string
        const jsonString = JSON.stringify(payload);

        // Convert the JSON string to a Buffer
        const buffer = Buffer.from(jsonString);

        // Convert the Buffer to a base64 encoded string
        const base64EncodedPayload = buffer.toString("base64");

        console.log("base64EncodedPayload", base64EncodedPayload);
        // Your salt key and salt index
        const saltKey = process.env.salt_key; // Replace with your actual salt key
        const saltIndex = process.env.salt_index; // Replace with your actual salt index

        // The string to be hashed
        const str = base64EncodedPayload + "/pg/v1/refund" + saltKey;

        // Create a SHA256 hash of the string
        const hash = crypto.createHash("sha256").update(str).digest("hex");

        // Append the salt index to the hash
        const result = hash + "###" + saltIndex;
        console.log("result", result);
        console.log("url", `${process.env.payment_url}/pg/v1/refund`);
        const options = {
            method: "POST",
            url: `${process.env.payment_url}/pg/v1/refund`,
            headers: {
                accept: "application/json",
                "Content-type": "application/json",
                "X-VERIFY": result,
            },
            data: { request: base64EncodedPayload },
        };
        await offer.save();
        const response = await axios.request(options);
        if (response.data.success === false) {
            return res.status(200).json({ message: "Please try again" });
        }
        res.status(200).json({ message: "refund initiated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const refundCallback = async (req, res) => {
    const { response } = req.body;
    const xVerifyHeader = req.headers["X-VERIFY"];
    try {
        const base64EncodedResponse = response;

        // Your salt key and salt index
        const saltKey = process.env.salt_key; // Replace with your actual salt key
        const saltIndex = process.env.salt_index; // Replace with your actual salt index

        // The string to be hashed
        const str = base64EncodedResponse + "/pg/v1/pay" + saltKey;

        // Create a SHA256 hash of the string
        const hash = crypto.createHash("sha256").update(str).digest("hex");

        // Append the salt index to the hash
        const result = hash + "###" + saltIndex;
        if (!(xVerifyHeader !== result)) {
            return res.status(400).json({ success: false });
        }

        // Create a buffer from the Base64 encoded string
        const buffer = Buffer.from(base64EncodedResponse, "base64");

        // Decode the buffer as UTF-8
        const decodedResponse = buffer.toString("utf8");
        const jsonResponse = JSON.parse(decodedResponse);
        const data = jsonResponse.data;
        const refund = await Refund.findOne({
            txnNumber: data.merchantTransactionId,
        });
        if (jsonResponse.code === "PAYMENT_SUCCESS") {
            refund.status = "success";
        }

        await refund.save();
        res.status(200).json({ message: "Completed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const checkStatusPayment = async (req, res) => {
    const { transactionId } = req.query;
    try {
        const url = `/pg/v1/status/${process.env.merchant_id}/${transactionId}`;
        const str = url + process.env.salt_key;
        // Create a SHA256 hash of the string
        const hash = crypto.createHash("sha256").update(str).digest("hex");
        const xVerifyHeader = hash + "###" + process.env.salt_index;
        const options = {
            method: "GET",
            url: `${process.env.payment_url}/pg/v1/status/${process.env.merchant_id}/${transactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": xVerifyHeader,
                "X-MERCHANT-ID": process.env.merchant_id,
            },
        };

        const response = await axios.request(options);
        const responseData = response.data;
        const ledger = await Ledger.findOne({ txnNumber: transactionId });
        ledger.orderId = responseData.data.transactionId;

        if (
            responseData.code === "PAYMENT_PENDING" &&
            ledger.status !== "pending"
        ) {
            ledger.status = "pending";
        }
        if (
            responseData.code === "PAYMENT_SUCCESS" &&
            ledger.status !== "success"
        ) {
            ledger.status = "success";
            ledger.paymentMode = responseData.data.paymentInstrument.type;
        }
        if (
            (responseData.code === "PAYMENT_ERROR" ||
                responseData.code === "PAYMENT_DECLINED" ||
                responseData.code === "TIMED_OUT") &&
            ledger.status !== "failed"
        ) {
            ledger.status = "failed";
        }
        await ledger.save();
        res.status(200).json({
            code: responseData.code,
            message: responseData.message,
            merchantId: responseData.data.merchantId,
            transactionId: responseData.data.merchantTransactionId,
            amount: responseData.data.amount / 100,
            providerReferenceId: responseData.data.transactionId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "something went wrong",
            code: "INTERNAL_SERVER_ERROR",
        });
    }
};

const checkStatusRefund = async (req, res) => {
    const { transactionId } = req.query;
    try {
        const url = `/pg/v1/status/${process.env.merchant_id}/${transactionId}`;
        const str = url + process.env.salt_key;
        // Create a SHA256 hash of the string
        const hash = crypto.createHash("sha256").update(str).digest("hex");
        const xVerifyHeader = hash + "###" + process.env.salt_index;
        const options = {
            method: "GET",
            url: `${process.env.payment_url}/pg/v1/status/${process.env.merchant_id}/${transactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": xVerifyHeader,
                "X-MERCHANT-ID": process.env.merchant_id,
            },
        };

        const response = await axios.request(options);
        const responseData = response.data;
        const ledger = await Refund.findOne({ txnNumber: transactionId });
        ledger.orderId = responseData.data.transactionId;

        if (
            responseData.code === "PAYMENT_PENDING" &&
            ledger.status !== "pending"
        ) {
            ledger.status = "pending";
        }
        if (
            responseData.code === "PAYMENT_SUCCESS" &&
            ledger.status !== "success"
        ) {
            ledger.status = "success";
            ledger.paymentMode = responseData.data.paymentInstrument.type;
        }
        if (
            (responseData.code === "PAYMENT_ERROR" ||
                responseData.code === "PAYMENT_DECLINED" ||
                responseData.code === "TRANSACTION_NOT_FOUND" ||
                responseData.code === "TIMED_OUT") &&
            ledger.status !== "failed"
        ) {
            ledger.status = "failed";
        }
        await ledger.save();
        res.status(200).json({
            code: responseData.code,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "something went wrong",
            code: "INTERNAL_SERVER_ERROR",
        });
    }
};

const getPaymentStatus = async (req, res) => {
    const { offerId } = req.query;
    try {
        const ledger = await Ledger.findOne({ offerId });
        res.status(200).json({ paymentStatus: ledger.status });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "something went wrong",
        });
    }
};

module.exports = {
    createOrder,
    confirmOrder,
    refund,
    redirectUrl,
    callBackUrl,
    payAPI,
    refundCallback,
    refundApi,
    checkStatusPayment,
    checkStatusRefund,
    getPaymentStatus,
};
