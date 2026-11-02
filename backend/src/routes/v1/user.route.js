const express = require('express');
const router = express.Router();

const authRoute = require('./user/auth.route');
const adminRoute = require('./admin.route');

router.use('/auth', authRoute);
router.use('/admin', adminRoute);

module.exports = router;
