const express = require('express');
const {
	getSubscriptions,
	getUserSubscription,
} = require('../../controllers/index.controllers');
const { authorizeRequest } = require('../../middleware/index.middleware');

const router = express.Router();

// router.route('/createOrder').post(authorizeRequest, createOrder);
// router.route('/confirmOrder').post(authorizeRequest, confirmOrder);
router.route('/getSubscriptions').get(authorizeRequest, getSubscriptions);
router
	.route('/getUserSubscriptions')
	.get(authorizeRequest, getUserSubscription);

module.exports = router;
