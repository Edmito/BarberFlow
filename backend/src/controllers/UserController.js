const { User } = require('../models');

// Listar usuários por tipo
const listUsersByRole = async (req, res) => {
  const { tipo } = req.query;

  try {
    const users = await User.findAll({
      where: { tipo },
      attributes: ['id', 'nome', 'email', 'telefone'],
    });

    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res
      .status(500)
      .json({ message: 'Erro ao listar usuários', error: error.message });
  }
};

// Atualizar usuário por ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.nome = nome || user.nome;
    user.email = email || user.email;
    user.telefone = telefone || user.telefone;

    await user.save();

    res.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res
      .status(500)
      .json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
};
// Deletar usuário por ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.destroy();

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res
      .status(500)
      .json({ message: 'Erro ao deletar usuário', error: error.message });
  }
};



module.exports = { listUsersByRole, updateUser, deleteUser };
