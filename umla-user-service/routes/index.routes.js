const express = require('express');
const router = express.Router();

const userRouter = require('./user/user.routes');

router.use('/user', userRouter);

module.exports = router;
