const express = require('express');
const router = express.Router();

const partnerRouter = require('./partner/partner.routes');

router.use('/partner', partnerRouter);

module.exports = router;
