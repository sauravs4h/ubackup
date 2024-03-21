const express = require('express');
const {
	handleSwipe,
	resetLikesCronRoute,
} = require('../../controllers/index.controllers');
const { authorizeRequest } = require('../../middleware/index.middleware');

const router = express.Router();

router.route('/handleSwipe').post(authorizeRequest, handleSwipe);
router.route('/cron').post(resetLikesCronRoute);

module.exports = router;
