const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cliente = require("./Cliente");

const Agendamento = sequelize.define("Agendamento", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clienteId: { 
        type: DataTypes.INTEGER, 
        references: { model: Cliente, key: "id" } 
    },
    dataHora: { type: DataTypes.DATE, allowNull: false },
    servico: { type: DataTypes.STRING, allowNull: false },
});

Cliente.hasMany(Agendamento);
Agendamento.belongsTo(Cliente);

module.exports = Agendamento;
