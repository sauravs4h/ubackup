const express = require('express');
const router = express.Router();

const chatRouter = require('./chat/chat.routes');

router.use('/chat', chatRouter);

module.exports = router;
