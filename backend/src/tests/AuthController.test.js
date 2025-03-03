const request = require('supertest');
const app = require('../../app'); // Importe o app Express
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock do modelo User
jest.mock('../models', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

// Mock do bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock do jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  describe('POST /auth/register', () => {
    it('deve criar um novo usuário', async () => {
      const mockUser = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'senha123',
        tipo: 'cliente',
      };

      User.create.mockResolvedValue(mockUser); // Mock do User.create

      const response = await request(app)
        .post('/auth/register')
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          senha: 'senha123',
          tipo: 'cliente',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário criado com sucesso!');
      expect(response.body.user).toEqual(mockUser);
    });

    it('deve retornar erro 400 ao criar usuário com dados inválidos', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          nome: '', // Nome inválido
          email: 'joao@example.com',
          senha: 'senha123',
          tipo: 'cliente',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('nome'); // Verifica se a mensagem de erro menciona o campo "nome"
    });
  });

  describe('POST /auth/login', () => {
    it('deve realizar login com credenciais válidas', async () => {
      const mockUser = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'senha123',
        tipo: 'cliente',
      };

      User.findOne.mockResolvedValue(mockUser); // Mock do User.findOne
      bcrypt.compare.mockResolvedValue(true); // Mock do bcrypt.compare
      jwt.sign.mockReturnValue('token_jwt_mockado'); // Mock do jwt.sign

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'joao@example.com',
          senha: 'senha123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login realizado com sucesso!');
      expect(response.body.token).toBe('token_jwt_mockado');
    });

    it('deve retornar erro 404 se o usuário não for encontrado', async () => {
      User.findOne.mockResolvedValue(null); // Mock de usuário não encontrado

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'naoexiste@example.com',
          senha: 'senha123',
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado');
    });

    it('deve retornar erro 400 se a senha estiver incorreta', async () => {
      const mockUser = {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        senha: 'senha123',
        tipo: 'cliente',
      };

      User.findOne.mockResolvedValue(mockUser); // Mock do User.findOne
      bcrypt.compare.mockResolvedValue(false); // Mock de senha incorreta

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'joao@example.com',
          senha: 'senha_errada',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Senha incorreta');
    });

    it('deve retornar erro 500 em caso de erro no servidor', async () => {
      User.findOne.mockRejectedValue(new Error('Erro no servidor')); // Mock de erro

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'joao@example.com',
          senha: 'senha123',
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao realizar login');
    });
  });
});