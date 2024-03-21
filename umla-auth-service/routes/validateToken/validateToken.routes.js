const express = require('express');
const { verifyToken } = require('../../middleware/index.middleware');
const { validateRequest } = require('../../controllers/index.controllers');
const router = express.Router();

router.route('/jwt').get(verifyToken, validateRequest);

module.exports = router;
