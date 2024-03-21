const express = require('express');
const router = express.Router();

const authRouter = require('./auth/userAuth.routes');
const tokenValidationRouter = require('./validateToken/validateToken.routes');

router.use('/userAuth', authRouter);
router.use('/validate', tokenValidationRouter);

module.exports = router;
