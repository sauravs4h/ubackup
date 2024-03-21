const {
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
} = require("./payment/payment.controllers");

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
