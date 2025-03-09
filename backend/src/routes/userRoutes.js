const express = require('express');
const router = express.Router();
const { listUsersByRole } = require('../controllers/UserController');

router.get('/', listUsersByRole);

module.exports = router;
