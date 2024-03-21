const express = require('express');
const router = express.Router();

const subscriptionRouter = require('./subscription/subscription.routes');

router.use('/subscription', subscriptionRouter);

module.exports = router;
