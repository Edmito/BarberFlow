const express = require('express');
const { getDashboardData } = require('../controllers/DashboardController');

const router = express.Router();

router.get('/', getDashboardData);

module.exports = router;
