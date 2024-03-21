const express = require('express');
const router = express.Router();

const paymentRouter = require('./payment/payment.routes');

router.use('/payment', paymentRouter);

module.exports = router;
