import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { isObject } from 'class-validator';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Case Node e2e', () => {
  let app: INestApplication;
  let idTest: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer()).get('/clientes').send();
    idTest = response.body[0].id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should list all clients', async () => {
    const response = await request(app.getHttpServer()).get('/clientes').send();
    const clientResult = Array.isArray(response.body);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(clientResult).toBeTruthy();
  });

  it('should return one single client', async () => {
    const response = await request(app.getHttpServer())
      .get(`/clientes/${idTest}`)
      .send();

    const clientResult = isObject(response.body);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(clientResult).toBeTruthy();
  });

  it('should create a new client', async () => {
    const response = await request(app.getHttpServer())
      .post('/clientes/novo')
      .send({
        id: randomUUID(),
        name: 'name',
        email: 'email@gmail.com',
        balance: 0,
        password: 1910,
      });

    expect(response.status).toBe(201);
  });

  it('should edit some information about the client', async () => {
    const response = await request(app.getHttpServer()).put('/clientes').send({
      id: idTest,
      name: 'update',
    });

    expect(response.status).toBe(200);
  });

  it('should delete a client', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/clientes/${idTest}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('should deposit some value', async () => {
    const response = await request(app.getHttpServer())
      .post(`/clientes/${idTest}/depositar`)
      .send({
        id: idTest,
        amount: 100,
      });

    expect(response.status).toBe(201);
  });

  it('should withdraw some value', async () => {
    const response = await request(app.getHttpServer())
      .post(`/clientes/${idTest}/sacar`)
      .send({
        id: randomUUID(),
        amount: 50,
        password: 4321,
      });

    expect(response.status).toBe(401);
  });
});
