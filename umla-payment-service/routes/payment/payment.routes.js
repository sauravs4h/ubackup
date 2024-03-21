const express = require("express");
const {
    createOrder,
    confirmOrder,
    refund,
    callBackUrl,
    payAPI,
    refundCallback,
    refundApi,
    checkStatusPayment,
    checkStatusRefund,
    getPaymentStatus,
} = require("../../controllers/index.controllers");
const { authorizeRequest } = require("../../middleware/index.middleware");

const router = express.Router();

router.route("/createOrder").post(authorizeRequest, createOrder);
router.route("/confirmOrder").post(authorizeRequest, confirmOrder);
// router.route("/refund").post(authorizeRequest, refund);
router.route("/callbackUrl").post(callBackUrl);
router.route("/callbackUrl/refund").post(refundCallback);
router.route("/payApi").post(authorizeRequest, payAPI);
router.route("/refund").post(authorizeRequest, refundApi);
router.route("/checkStatus").get(checkStatusPayment);
router.route("/checkStatus/refund").get(checkStatusRefund);
router.route("/checkPaymentStatus").get(getPaymentStatus);
module.exports = router;
