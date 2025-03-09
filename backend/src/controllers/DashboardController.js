const { Op, fn, col, literal } = require('sequelize');
const { User, Appointment, Payment, Service } = require('../models');

const getDashboardData = async (req, res) => {
  try {
    // Data de hoje
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Receita do Dia (soma de pagamentos de hoje)
    const paymentsToday = await Payment.findAll({
      where: { createdAt: { [Op.between]: [todayStart, todayEnd] } },
    });
    const revenueOfDay = paymentsToday.reduce(
      (acc, payment) => acc + payment.valor,
      0,
    );

    // Clientes Atendidos (número de agendamentos de hoje)
    const clientsAttended = await Appointment.count({
      where: { data_hora: { [Op.between]: [todayStart, todayEnd] } },
    });

    // Próximo Agendamento (agendamento com data_hora > agora)
    const nextAppointmentRecord = await Appointment.findOne({
      where: { data_hora: { [Op.gt]: new Date() } },
      order: [['data_hora', 'ASC']],
      include: [
        { model: User, as: 'cliente', attributes: ['nome'] },
        { model: Service, attributes: ['nome'] },
      ],
    });
    let nextAppointment = null;
    if (nextAppointmentRecord) {
      nextAppointment = {
        client: nextAppointmentRecord.cliente
          ? nextAppointmentRecord.cliente.nome
          : '',
        service: nextAppointmentRecord.Service
          ? nextAppointmentRecord.Service.nome
          : '',
        time: nextAppointmentRecord.data_hora.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    }

    // Serviço mais Popular: busca o serviço com maior quantidade de agendamentos
    const popular = await Appointment.findAll({
      attributes: ['servico_id', [fn('COUNT', col('servico_id')), 'count']],
      group: ['servico_id'],
      order: [[literal('count'), 'DESC']],
      limit: 1,
    });
    let mostPopularService = null;
    if (popular.length > 0) {
      const service = await Service.findByPk(popular[0].servico_id);
      mostPopularService = service ? service.nome : null;
    }

    // Receita dos Últimos 7 Dias: soma dos pagamentos agrupados por dia
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    // Utiliza hojeEnd já definido no início para limitar a data atual
    const revenueDataRaw = await Payment.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'day'],
        [fn('SUM', col('valor')), 'value'],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, todayEnd],
        },
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
    });
    const revenueData = revenueDataRaw.map((record) => ({
      day: record.get('day'),
      value: parseFloat(record.get('value')),
    }));

    // Distribuição de Serviços: conta de agendamentos agrupados por serviço
    const servicesDataRaw = await Appointment.findAll({
      attributes: ['servico_id', [fn('COUNT', col('servico_id')), 'count']],
      group: ['servico_id'],
      order: [[literal('count'), 'DESC']],
    });
    const servicesData = await Promise.all(
      servicesDataRaw.map(async (record) => {
        const service = await Service.findByPk(record.servico_id);
        return {
          name: service ? service.nome : 'Desconhecido',
          value: parseInt(record.get('count')),
        };
      }),
    );

    res.json({
      revenueOfDay,
      clientsAttended,
      nextAppointment,
      mostPopularService,
      revenueData,
      servicesData,
    });
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    res.status(500).json({
      message: 'Erro ao carregar dados do dashboard',
      error: error.message,
    });
  }
};

module.exports = { getDashboardData };
