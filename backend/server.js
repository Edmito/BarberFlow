const app = require('./app'); // Importe o app Express
const db = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Sincroniza os modelos com o banco de dados
db.sequelize.sync({ force: false }).then(() => {
  console.log('Tabelas sincronizadas com o banco de dados.');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => {
  console.error('Erro ao sincronizar o banco de dados:', err);
});