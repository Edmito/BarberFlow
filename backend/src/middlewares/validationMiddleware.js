const {
  userSchema,
  appointmentSchema,
  serviceSchema,
  paymentSchema,
} = require('../validations/schemas');

// Função genérica para validação
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false retorna todos os erros
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ message: `Erro de validação: ${errorMessages}` });
  }
  next();
};

// Middlewares específicos
const validateRegister = validateRequest(userSchema);
const validateAppointment = validateRequest(appointmentSchema);
const validateService = validateRequest(serviceSchema);
const validatePayment = validateRequest(paymentSchema);

module.exports = {
  validateRegister,
  validateAppointment,
  validateService,
  validatePayment,
};