const express = require('express');
const { register, login } = require('../controllers/AuthController');
const { validateRegister } = require('../middlewares/validationMiddleware');
const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', login);

module.exports = router;
