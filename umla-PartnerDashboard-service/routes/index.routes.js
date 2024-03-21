const express = require('express');
const router = express.Router();

const userRouter = require('./dashboard/dashboard.routes');

router.use('/dashboard', userRouter);

module.exports = router;
