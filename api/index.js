const express = require('express');
const users = require('./users');

const router = express.Router({ mergeParams: true });
router.use('/users', users);

module.exports = router;
