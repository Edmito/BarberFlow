const request = require('supertest');
const app = require('../../app'); // Importe o app Express
const { Payment, Appointment } = require('../models');

jest.mock('../models');

describe('PaymentController /api/payments', () => {
  beforeEach(async () => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  describe('POST /api/payments', () => {
    it('deve criar um novo pagamento', async () => {
      const paymentData = {
        agendamento_id: 1,
        valor: 100,
        forma_pagamento: 'PIX',
      };

      Appointment.findByPk.mockResolvedValue({ id: 1 });
      Payment.create.mockResolvedValue(paymentData);

      const response = await request(app)
        .post('/api/payments')
        .send(paymentData);

      expect(Appointment.findByPk).toHaveBeenCalledWith(1);
      expect(Payment.create).toHaveBeenCalledWith(paymentData);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Pagamento registrado com sucesso!');
    });

    it('deve retornar erro 404 se o agendamento não for encontrado', async () => {
      Appointment.findByPk.mockResolvedValue(null);

      const response = await request(app).post('/api/payments').send({
        agendamento_id: 999,
        valor: 100,
        forma_pagamento: 'PIX',
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Agendamento não encontrado');
    });
  });

  describe('GET /api/payments', () => {
    it('deve listar todos os pagamentos', async () => {
      const paymentsMock = [
        {
          id: 1,
          agendamento_id: 1,
          valor: 100,
          forma_pagamento: 'PIX',
        },
      ];
      Payment.findAll.mockResolvedValue(paymentsMock);

      const response = await request(app).get('/api/payments');

      expect(Payment.findAll).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.payments).toEqual(paymentsMock);
    });
  });
});
