const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { nome, email, senha, telefone, tipo } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    const user = await User.create({
      nome,
      email,
      senha,
      telefone,
      tipo,
    });

    console.log(`Usuário criado com sucesso: ${user.email}`); // Log informativo
    res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    console.error('Erro ao criar usuário:', error); // Log de erro
    res.status(400).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    console.log(`Tentativa de login para o email: ${email}`); // Log informativo

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`Usuário não encontrado para o email: ${email}`); // Log informativo
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    console.log(`Comparação de senha para a senha: ${senha} - Match: ${isMatch}`); // Log informativo

    if (!isMatch) {
      console.log(`Senha incorreta para o email: ${email}`); // Log informativo
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    console.log(`Login realizado com sucesso para o email: ${email}`); // Log informativo
    res.json({ message: 'Login realizado com sucesso!', token });
  } catch (error) {
    console.error('Erro ao realizar login:', error); // Log de erro
    res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
  }
};

module.exports = { register, login };