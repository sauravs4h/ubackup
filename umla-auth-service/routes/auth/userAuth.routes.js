const express = require('express');
const {
	sendOtp,
	verifyOtp,
} = require('../../controllers/auth/user/userAuth.controllers');
const router = express.Router();

router.route('/sendOtp').post(sendOtp);
router.route('/verifyOtp').post(verifyOtp);

module.exports = router;
