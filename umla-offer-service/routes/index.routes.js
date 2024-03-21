const express = require('express');
const router = express.Router();

const offerRouter = require('./offer/offer.routes');

router.use('/offer', offerRouter);

module.exports = router;
