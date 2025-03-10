const bcrypt = require('bcrypt');

('use strict');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Populando a tabela Users
    const salt = bcrypt.genSaltSync(10);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          nome: 'Ed',
          email: 'ed@gg.com',
          senha: bcrypt.hashSync('123456', salt),
          tipo: 'cliente',
          telefone: '73981582056',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Leo',
          email: 'leo@example.com',
          senha: bcrypt.hashSync('123456', salt),
          tipo: 'funcionario',
          telefone: '73976415678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Diego',
          email: 'diego@gg.com',
          senha: bcrypt.hashSync('123456', salt),
          tipo: 'cliente',
          telefone: '73992341498',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Populando a tabela Services
    await queryInterface.bulkInsert(
      'Services',
      [
        {
          nome: 'Corte de Cabelo',
          preco: 50,
          duracao: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Barba',
          preco: 30,
          duracao: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Corte e Barba',
          preco: 70,
          duracao: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Manicure',
          preco: 40,
          duracao: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Pedicure',
          preco: 45,
          duracao: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Manicure e Pedicure',
          preco: 80,
          duracao: 90,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nome: 'Massagem',
          preco: 100,
          duracao: 60,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Populando a tabela Appointments
    await queryInterface.bulkInsert(
      'Appointments',
      [
        {
          cliente_id: 1,
          funcionario_id: 2,
          servico_id: 1,
          data_hora: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          cliente_id: 3,
          funcionario_id: 2,
          servico_id: 2,
          data_hora: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );

    // Populando a tabela Payments
    await queryInterface.bulkInsert(
      'Payments',
      [
        {
          agendamento_id: 1,
          valor: 50,
          forma_pagamento: 'PIX',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          agendamento_id: 2,
          valor: 30,
          forma_pagamento: 'cartão',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    // Removendo os dados das tabelas na ordem correta
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('Appointments', null, {});
    await queryInterface.bulkDelete('Services', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
