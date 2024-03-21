const express = require('express');
const {
	getAvailableRooms,
	getChat,
	unmatch,
} = require('../../controllers/index.controllers');
const { authorizeRequest } = require('../../middleware/index.middleware');
const { sendPushNotification } = require('../../utils/notification.utils');

const router = express.Router();

router.route('/room').get(authorizeRequest, getAvailableRooms);
router.route('/history/:roomId/:page').get(authorizeRequest, getChat);
router.route('/unmatch').post(authorizeRequest, unmatch);

module.exports = router;
