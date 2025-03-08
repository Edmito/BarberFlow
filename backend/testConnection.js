const sequelize = require('./src/config/database');

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o MySQL estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MySQL:', err);
  });
