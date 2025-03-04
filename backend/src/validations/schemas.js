const Joi = require('joi');

// Esquema de validação para usuários
const userSchema = Joi.object({
  nome: Joi.string().min(2).required().empty('').messages({
    'string.empty': 'O nome não pode estar vazio.',
    'string.min': 'O nome deve ter pelo menos 2 caracteres.',
    'any.required': 'O nome é obrigatório.',
  }),
  email: Joi.string().email().required().empty('').messages({
    'string.empty': 'O e-mail não pode estar vazio.',
    'string.email': 'O e-mail deve ser válido.',
    'any.required': 'O e-mail é obrigatório.',
  }),
  senha: Joi.string().min(6).required().empty('').messages({
    'string.empty': 'A senha não pode estar vazia.',
    'string.min': 'A senha deve ter pelo menos 6 caracteres.',
    'any.required': 'A senha é obrigatória.',
  }),
  tipo: Joi.string()
    .valid('cliente', 'funcionario')
    .required()
    .empty('')
    .messages({
      'string.empty': 'O tipo não pode estar vazio.',
      'any.only': 'O tipo deve ser "cliente" ou "funcionario".',
      'any.required': 'O tipo é obrigatório.',
    }),
});

// Esquema de validação para agendamentos
const appointmentSchema = Joi.object({
  cliente_id: Joi.number().required().empty('').messages({
    'number.base': 'O ID do cliente deve ser um número.',
    'any.required': 'O ID do cliente é obrigatório.',
    'any.empty': 'O ID do cliente não pode estar vazio.',
  }),
  funcionario_id: Joi.number().required().empty('').messages({
    'number.base': 'O ID do funcionário deve ser um número.',
    'any.required': 'O ID do funcionário é obrigatório.',
    'any.empty': 'O ID do funcionário não pode estar vazio.',
  }),
  servico_id: Joi.number().required().empty('').messages({
    'number.base': 'O ID do serviço deve ser um número.',
    'any.required': 'O ID do serviço é obrigatório.',
    'any.empty': 'O ID do serviço não pode estar vazio.',
  }),
  data_hora: Joi.date().required().empty('').messages({
    'date.base': 'A data e hora devem ser válidas.',
    'any.required': 'A data e hora são obrigatórias.',
    'any.empty': 'A data e hora não podem estar vazias.',
  }),
});

// Esquema de validação para serviços
const serviceSchema = Joi.object({
  nome: Joi.string().min(3).required().empty('').messages({
    'string.empty': 'O nome do serviço não pode estar vazio.',
    'string.min': 'O nome do serviço deve ter pelo menos 3 caracteres.',
    'any.required': 'O nome do serviço é obrigatório.',
  }),
  preco: Joi.number().positive().required().empty('').messages({
    'number.base': 'O preço deve ser um número.',
    'number.positive': 'O preço deve ser positivo.',
    'any.required': 'O preço é obrigatório.',
    'any.empty': 'O preço não pode estar vazio.',
  }),
  duracao: Joi.number().positive().required().empty('').messages({
    'number.base': 'A duração deve ser um número.',
    'number.positive': 'A duração deve ser positiva.',
    'any.required': 'A duração é obrigatória.',
    'any.empty': 'A duração não pode estar vazia.',
  }),
});

// Esquema de validação para pagamentos
const paymentSchema = Joi.object({
  agendamento_id: Joi.number().required().empty('').messages({
    'number.base': 'O ID do agendamento deve ser um número.',
    'any.required': 'O ID do agendamento é obrigatório.',
    'any.empty': 'O ID do agendamento não pode estar vazio.',
  }),
  valor: Joi.number().positive().required().empty('').messages({
    'number.base': 'O valor deve ser um número.',
    'number.positive': 'O valor deve ser positivo.',
    'any.required': 'O valor é obrigatório.',
    'any.empty': 'O valor não pode estar vazio.',
  }),
  forma_pagamento: Joi.string()
    .valid('PIX', 'cartão', 'dinheiro')
    .required()
    .empty('')
    .messages({
      'string.empty': 'A forma de pagamento não pode estar vazia.',
      'any.only':
        'A forma de pagamento deve ser "PIX", "cartão" ou "dinheiro".',
      'any.required': 'A forma de pagamento é obrigatória.',
    }),
});

module.exports = {
  userSchema,
  appointmentSchema,
  serviceSchema,
  paymentSchema,
};
