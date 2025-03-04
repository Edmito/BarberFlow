const request = require('supertest');
const app = require('../../app'); // Importe o app Express
const { Service } = require('../models');

jest.mock('../models');

describe('ServiceController /api/services', () => {
  describe('POST /api/services', () => {
    it('deve criar um serviço com sucesso', async () => {
      const serviceData = { nome: 'Corte', preco: 50, duracao: 30 };
      Service.create.mockResolvedValue(serviceData);

      const response = await request(app)
        .post('/api/services')
        .send(serviceData);

      expect(Service.create).toHaveBeenCalledWith(serviceData);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Serviço criado com sucesso!',
        service: serviceData,
      });
    });
  });

  describe('GET /api/services', () => {
    it('deve listar todos os serviços', async () => {
      const servicesMock = [{ id: 1, nome: 'Corte', preco: 50, duracao: 30 }];
      Service.findAll.mockResolvedValue(servicesMock);

      const response = await request(app).get('/api/services');

      expect(Service.findAll).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ services: servicesMock });
    });
  });

  describe('PUT /api/services/:id', () => {
    it('deve atualizar um serviço existente', async () => {
      const serviceMock = { update: jest.fn() };
      Service.findByPk.mockResolvedValue(serviceMock);

      const updatedData = { nome: 'Corte Simples', preco: 40, duracao: 25 };
      const response = await request(app)
        .put('/api/services/1')
        .send(updatedData);

      expect(Service.findByPk).toHaveBeenCalledWith('1');
      expect(serviceMock.update).toHaveBeenCalledWith(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Serviço atualizado com sucesso!');
    });
  });

  describe('DELETE /api/services/:id', () => {
    it('deve remover um serviço existente e retornar uma mensagem de sucesso', async () => {
      const serviceMock = { destroy: jest.fn() };
      Service.findByPk.mockResolvedValue(serviceMock);

      const response = await request(app).delete('/api/services/1');

      expect(Service.findByPk).toHaveBeenCalledWith('1');
      expect(serviceMock.destroy).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Serviço removido com sucesso!',
      });
    });

    it('deve retornar 404 se o serviço não for encontrado', async () => {
      Service.findByPk.mockResolvedValue(null);

      const response = await request(app).delete('/api/services/999');

      expect(Service.findByPk).toHaveBeenCalledWith('999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Serviço não encontrado' });
    });
  });
});
