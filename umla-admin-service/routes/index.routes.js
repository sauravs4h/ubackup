const express = require('express');
const router = express.Router();

const adminRouter = require('./admin/admin.routes');

router.use('/admin', adminRouter);

module.exports = router;
