const express = require('express');
const router = express.Router();

const swipeRouter = require('./swipe/swipe.routes');

router.use('/swipe', swipeRouter);

module.exports = router;
