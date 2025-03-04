'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.User, {
        as: 'cliente',
        foreignKey: 'cliente_id',
      });
      Appointment.belongsTo(models.User, {
        as: 'funcionario',
        foreignKey: 'funcionario_id',
      });
      Appointment.belongsTo(models.Service, { foreignKey: 'servico_id' });
    }
  }

  Appointment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      funcionario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      servico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'id',
        },
      },
      data_hora: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Appointment',
    },
  );

  return Appointment;
};
