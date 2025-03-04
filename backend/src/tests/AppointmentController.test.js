const request = require('supertest');
const app = require('../../app'); // Importe o app Express
const { Appointment, User, Service } = require('../models');

jest.mock('../models');

describe('AppointmentController /api/appointments', () => {
  beforeEach(async () => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  describe('POST /api/appointments', () => {
    it('deve criar um novo agendamento', async () => {
      const appointmentData = {
        cliente_id: 1,
        funcionario_id: 2,
        servico_id: 1,
        data_hora: '2023-10-25T14:00:00Z',
      };

      User.findByPk
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      Service.findByPk.mockResolvedValue({ id: 1 });
      Appointment.create.mockResolvedValue(appointmentData);

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(User.findByPk).toHaveBeenCalledWith(2);
      expect(Service.findByPk).toHaveBeenCalledWith(1);
      expect(Appointment.create).toHaveBeenCalledWith(appointmentData);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Agendamento criado com sucesso!');
    });

    it('deve retornar erro 404 se cliente, funcionário ou serviço não forem encontrados', async () => {
      User.findByPk.mockResolvedValueOnce(null);

      const response = await request(app).post('/api/appointments').send({
        cliente_id: 1,
        funcionario_id: 2,
        servico_id: 1,
        data_hora: '2023-10-25T14:00:00Z',
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        'Cliente, funcionário ou serviço não encontrado',
      );
    });

    it('deve retornar erro 400 se houver conflito de horário', async () => {
      User.findByPk
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      Service.findByPk.mockResolvedValue({ id: 1 });
      Appointment.findOne.mockResolvedValue({ id: 1 });

      const response = await request(app).post('/api/appointments').send({
        cliente_id: 1,
        funcionario_id: 2,
        servico_id: 1,
        data_hora: '2023-10-25T14:00:00Z',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Conflito de horário para o funcionário',
      );
    });
  });

  describe('GET /api/appointments', () => {
    it('deve listar todos os agendamentos', async () => {
      const appointmentsMock = [
        {
          id: 1,
          cliente_id: 1,
          funcionario_id: 2,
          servico_id: 1,
          data_hora: '2023-10-25T14:00:00Z',
        },
      ];
      Appointment.findAll.mockResolvedValue(appointmentsMock);

      const response = await request(app).get('/api/appointments');

      expect(Appointment.findAll).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.agendamentos).toEqual(appointmentsMock);
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('deve cancelar um agendamento existente e retornar uma mensagem de sucesso', async () => {
      const appointmentMock = { destroy: jest.fn() };
      Appointment.findByPk.mockResolvedValue(appointmentMock);

      const response = await request(app).delete('/api/appointments/1');

      expect(Appointment.findByPk).toHaveBeenCalledWith('1');
      expect(appointmentMock.destroy).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Agendamento cancelado com sucesso!',
      });
    });

    it('deve retornar 404 se o agendamento não for encontrado', async () => {
      Appointment.findByPk.mockResolvedValue(null);

      const response = await request(app).delete('/api/appointments/999');

      expect(Appointment.findByPk).toHaveBeenCalledWith('999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Agendamento não encontrado' });
    });
  });
});
