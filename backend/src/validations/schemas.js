const Joi = require('joi');

// Esquema de validação para usuários
const userSchema = Joi.object({
  nome: Joi.string().min(2).required().messages({
    'string.min': 'O nome deve ter pelo menos 3 caracteres.',
    'any.required': 'O nome é obrigatório.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'O e-mail deve ser válido.',
    'any.required': 'O e-mail é obrigatório.',
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve ter pelo menos 6 caracteres.',
    'any.required': 'A senha é obrigatória.',
  }),
  tipo: Joi.string().valid('cliente', 'funcionario').required().messages({
    'any.only': 'O tipo deve ser "cliente" ou "funcionario".',
    'any.required': 'O tipo é obrigatório.',
  }),
});

// Esquema de validação para agendamentos
const appointmentSchema = Joi.object({
  cliente_id: Joi.number().required().messages({
    'number.base': 'O ID do cliente deve ser um número.',
    'any.required': 'O ID do cliente é obrigatório.',
  }),
  funcionario_id: Joi.number().required().messages({
    'number.base': 'O ID do funcionário deve ser um número.',
    'any.required': 'O ID do funcionário é obrigatório.',
  }),
  servico_id: Joi.number().required().messages({
    'number.base': 'O ID do serviço deve ser um número.',
    'any.required': 'O ID do serviço é obrigatório.',
  }),
  data_hora: Joi.date().required().messages({
    'date.base': 'A data e hora devem ser válidas.',
    'any.required': 'A data e hora são obrigatórias.',
  }),
});

// Esquema de validação para serviços
const serviceSchema = Joi.object({
  nome: Joi.string().min(3).required().messages({
    'string.min': 'O nome do serviço deve ter pelo menos 3 caracteres.',
    'any.required': 'O nome do serviço é obrigatório.',
  }),
  preco: Joi.number().positive().required().messages({
    'number.base': 'O preço deve ser um número.',
    'number.positive': 'O preço deve ser positivo.',
    'any.required': 'O preço é obrigatório.',
  }),
  duracao: Joi.number().positive().required().messages({
    'number.base': 'A duração deve ser um número.',
    'number.positive': 'A duração deve ser positiva.',
    'any.required': 'A duração é obrigatória.',
  }),
});

// Esquema de validação para pagamentos
const paymentSchema = Joi.object({
  agendamento_id: Joi.number().required().messages({
    'number.base': 'O ID do agendamento deve ser um número.',
    'any.required': 'O ID do agendamento é obrigatório.',
  }),
  valor: Joi.number().positive().required().messages({
    'number.base': 'O valor deve ser um número.',
    'number.positive': 'O valor deve ser positivo.',
    'any.required': 'O valor é obrigatório.',
  }),
  forma_pagamento: Joi.string()
    .valid('PIX', 'cartão', 'dinheiro')
    .required()
    .messages({
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
