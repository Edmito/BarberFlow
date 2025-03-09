const { User } = require('../models');

const listUsersByRole = async (req, res) => {
  const { tipo } = req.query;

  try {
    const users = await User.findAll({
      where: { tipo },
      attributes: ['id', 'nome', 'email'],
    });

    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res
      .status(500)
      .json({ message: 'Erro ao listar usuários', error: error.message });
  }
};

module.exports = { listUsersByRole };
