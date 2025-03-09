const express = require('express');
const authRoutes = require('./authRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const serviceRoutes = require('./serviceRoutes');
const paymentRoutes = require('./paymentRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);

module.exports = router;