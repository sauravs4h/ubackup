const { sendOtp, verifyOtp } = require('./auth/user/userAuth.controllers');
const {
	validateRequest,
} = require('./validateRequest/validateRequest.controllers');

module.exports = { sendOtp, verifyOtp, validateRequest };

