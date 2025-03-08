'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Appointment, { foreignKey: 'agendamento_id' });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      agendamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Appointments',
          key: 'id',
        },
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      forma_pagamento: {
        type: DataTypes.ENUM('PIX', 'cartão', 'dinheiro'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Payment',
    },
  );

  return Payment;
};
