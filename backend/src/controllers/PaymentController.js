const { Payment, Appointment, User, Service } = require('../models');

// Criar um pagamento
const create = async (req, res) => {
  const { agendamento_id, valor, forma_pagamento } = req.body;

  try {
    const agendamento = await Appointment.findByPk(agendamento_id);
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    const payment = await Payment.create({
      agendamento_id,
      valor,
      forma_pagamento,
    });
    res
      .status(201)
      .json({ message: 'Pagamento registrado com sucesso!', payment });
  } catch (error) {
    console.error('Erro ao registrar pagamento:', error);
    res
      .status(500)
      .json({ message: 'Erro ao registrar pagamento', error: error.message });
  }
};

// Listar todos os pagamentos
const list = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Appointment,
          include: [
            { model: User, as: 'cliente', attributes: ['nome', 'email'] },
            { model: User, as: 'funcionario', attributes: ['nome', 'email'] },
            { model: Service, attributes: ['nome', 'preco', 'duracao'] },
          ],
        },
      ],
    });
    res.json({ payments });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res
      .status(500)
      .json({ message: 'Erro ao listar pagamentos', error: error.message });
  }
};

module.exports = { create, list };
