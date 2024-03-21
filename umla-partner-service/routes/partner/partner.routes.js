const express = require('express');
const {
	login,
	addOutletMenu,
	addOutletDetails,
	addPartnerDetails,
} = require('../../controllers/index.controllers');
const { authorizeRequest } = require('../../middleware/index.middleware');

const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 20 * 1024 * 1024, // 10 MB in bytes (you can adjust this value)
	},
});

router.route('/login').post(login);
router
	.route('/partnerDetail')
	.post(authorizeRequest, upload.array('files', 6), addPartnerDetails);
router
	.route('/outletDetail')
	.post(authorizeRequest, upload.array('files', 6), addOutletDetails);
router
	.route('/menu')
	.post(authorizeRequest, upload.array('files', 6), addOutletMenu);

module.exports = router;
