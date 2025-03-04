const { Appointment, User, Service } = require('../models');

// Criar um agendamento
const create = async (req, res) => {
  const { cliente_id, funcionario_id, servico_id, data_hora } = req.body;

  try {
    // Verifica se o cliente, funcionário e serviço existem
    const cliente = await User.findByPk(cliente_id);
    const funcionario = await User.findByPk(funcionario_id);
    const servico = await Service.findByPk(servico_id);

    if (!cliente || !funcionario || !servico) {
      return res
        .status(404)
        .json({ message: 'Cliente, funcionário ou serviço não encontrado' });
    }

    // Verifica conflitos de horário
    const conflito = await Appointment.findOne({
      where: {
        funcionario_id,
        data_hora,
      },
    });

    if (conflito) {
      return res
        .status(400)
        .json({ message: 'Conflito de horário para o funcionário' });
    }

    // Cria o agendamento
    const agendamento = await Appointment.create({
      cliente_id,
      funcionario_id,
      servico_id,
      data_hora,
    });

    res
      .status(201)
      .json({ message: 'Agendamento criado com sucesso!', agendamento });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res
      .status(500)
      .json({ message: 'Erro ao criar agendamento', error: error.message });
  }
};

// Listar todos os agendamentos
const list = async (req, res) => {
  try {
    const agendamentos = await Appointment.findAll({
      include: [
        { model: User, as: 'cliente', attributes: ['nome', 'email'] },
        { model: User, as: 'funcionario', attributes: ['nome', 'email'] },
        { model: Service, attributes: ['nome', 'preco', 'duracao'] },
      ],
    });

    res.json({ agendamentos });
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res
      .status(500)
      .json({ message: 'Erro ao listar agendamentos', error: error.message });
  }
};

// Cancelar um agendamento
const cancel = async (req, res) => {
  const { id } = req.params;

  try {
    const agendamento = await Appointment.findByPk(id);
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    await agendamento.destroy();
    res.json({ message: 'Agendamento cancelado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res
      .status(500)
      .json({ message: 'Erro ao cancelar agendamento', error: error.message });
  }
};

module.exports = { create, list, cancel };
