const { Service } = require('../models');

const create = async (req, res) => {
  const { nome, preco, duracao } = req.body;

  try {
    console.log('Tentando criar serviço:', { nome, preco, duracao });
    const service = await Service.create({ nome, preco, duracao });
    console.log('Serviço criado com sucesso:', service);
    res.status(201).json({ message: 'Serviço criado com sucesso!', service });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res
      .status(400)
      .json({ message: 'Erro ao criar serviço', error: error.message });
  }
};

const list = async (req, res) => {
  try {
    console.log('Tentando listar serviços...');
    const services = await Service.findAll();
    console.log('Serviços encontrados:', services);
    res.json({ services });
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    res
      .status(500)
      .json({ message: 'Erro ao listar serviços', error: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, duracao } = req.body;

  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    await service.update({ nome, preco, duracao });
    res.json({ message: 'Serviço atualizado com sucesso!', service });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar serviço', error });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    await service.destroy();
    res.json({ message: 'Serviço removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover serviço:', error); // Log do erro no servidor
    res
      .status(500)
      .json({ message: 'Erro ao remover serviço', error: error.message }); // Passa apenas a mensagem
  }
};

module.exports = { create, list, update, remove };
