const express = require('express');
const {
  create,
  list,
  findByAppointmentId,
} = require('../controllers/PaymentController');
const { validatePayment } = require('../middlewares/validationMiddleware');
const router = express.Router();

// Rotas para pagamentos
router.post('/', validatePayment, create);
router.get('/', list);
router.get('/by', findByAppointmentId);

module.exports = router;
