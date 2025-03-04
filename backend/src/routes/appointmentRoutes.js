const express = require('express');
const {
  create,
  list,
  cancel,
} = require('../controllers/AppointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateAppointment } = require('../middlewares/validationMiddleware');
const router = express.Router();

// Rotas para agendamentos
router.post('/', validateAppointment, create);
router.get('/', list);
router.delete('/:id', cancel);

module.exports = router;
