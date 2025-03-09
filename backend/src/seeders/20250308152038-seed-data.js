const bcrypt = require('bcrypt');

('use strict');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10);

    // Inserir 10 clientes
    const clients = [
      {
        nome: 'Ed',
        email: 'ed@gg.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73981582056',
      },
      {
        nome: 'Diego',
        email: 'diego@gg.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73992341498',
      },
      {
        nome: 'Ana',
        email: 'ana@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73912345678',
      },
      {
        nome: 'Bruno',
        email: 'bruno@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73923456789',
      },
      {
        nome: 'Carla',
        email: 'carla@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73934567890',
      },
      {
        nome: 'Daniel',
        email: 'daniel@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73945678901',
      },
      {
        nome: 'Elisa',
        email: 'elisa@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73956789012',
      },
      {
        nome: 'Fabio',
        email: 'fabio@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73967890123',
      },
      {
        nome: 'Giovana',
        email: 'giovana@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73978901234',
      },
      {
        nome: 'Henrique',
        email: 'henrique@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'cliente',
        telefone: '73989012345',
      },
    ].map((user) => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Inserir 2 funcionários (para atendimento)
    const employees = [
      {
        nome: 'Leo',
        email: 'leo@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'funcionario',
        telefone: '73976415678',
      },
      {
        nome: 'Mariana',
        email: 'mariana@example.com',
        senha: bcrypt.hashSync('123456', salt),
        tipo: 'funcionario',
        telefone: '73980123456',
      },
    ].map((user) => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Users', [...clients, ...employees], {});

    // Inserir serviços (caso não existam)
    const services = [
      { nome: 'Corte de Cabelo', preco: 50, duracao: 30 },
      { nome: 'Barba', preco: 30, duracao: 20 },
      { nome: 'Corte e Barba', preco: 70, duracao: 50 },
      { nome: 'Manicure', preco: 40, duracao: 45 },
      { nome: 'Pedicure', preco: 45, duracao: 50 },
      { nome: 'Manicure e Pedicure', preco: 80, duracao: 90 },
      { nome: 'Massagem', preco: 100, duracao: 60 },
    ].map((service) => ({
      ...service,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Services', services, {});

    // Utilitários para sortear dados
    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Buscar IDs gerados
    const users = await queryInterface.sequelize.query(
      'SELECT id, tipo FROM Users;',
    );
    const userRows = users[0];
    const clientIds = userRows
      .filter((u) => u.tipo === 'cliente')
      .map((u) => u.id);
    const employeeIds = userRows
      .filter((u) => u.tipo === 'funcionario')
      .map((u) => u.id);

    const serviceRows = await queryInterface.sequelize.query(
      'SELECT id, preco FROM Services;',
    );
    const servicesData = serviceRows[0];

    // Gerar agendamentos: 3 por dia
    let appointments = [];
    let payments = [];
    const now = new Date();
    for (let dayOffset = -7; dayOffset < 5; dayOffset++) {
      // Definir data base para o dia corrente
      const day = new Date(now);
      day.setDate(day.getDate() + dayOffset);
      // Criar 3 agendamentos com horários fixos para o dia
      const horarios = ['10:00', '13:00', '16:00'];
      for (let horario of horarios) {
        // Construir a data completa com o horário
        const [hours, minutes] = horario.split(':');
        const appointmentDate = new Date(day);
        appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const appointment = {
          cliente_id: clientIds[getRandomInt(0, clientIds.length - 1)],
          funcionario_id: employeeIds[getRandomInt(0, employeeIds.length - 1)],
          servico_id: servicesData[getRandomInt(0, servicesData.length - 1)].id,
          data_hora: appointmentDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        appointments.push(appointment);
      }
    }

    await queryInterface.bulkInsert('Appointments', appointments, {});

    // Gerar pagamento para cada agendamento
    // Primeiro, buscamos os agendamentos inseridos para relacioná-los
    const appointmentsRows = await queryInterface.sequelize.query(
      'SELECT id, servico_id, data_hora FROM Appointments;',
    );
    const appointmentRecords = appointmentsRows[0];

    appointmentRecords.forEach((appointment) => {
      // Buscar o valor do serviço
      const servico = servicesData.find((s) => s.id === appointment.servico_id);
      const valor = servico ? servico.preco : 0;
      const paymentMethods = ['PIX', 'CARTÃO', 'DINHEIRO'];
      const selectedPaymentMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      payments.push({
        agendamento_id: appointment.id,
        valor,
        forma_pagamento: selectedPaymentMethod,
        createdAt: new Date(appointment.data_hora),
      });
    });

    await queryInterface.bulkInsert('Payments', payments, {});
    
  },
  

  async down(queryInterface, Sequelize) {
    // Remover os dados nas tabelas na ordem correta
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('Appointments', null, {});
    await queryInterface.bulkDelete('Services', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
