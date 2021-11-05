import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../../src/app';

import createFakeUser from '../util/createFakeUser';

describe('User login', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: '__tests__/database.sqlite',
      entities: ['./src/entities/*.ts'],
      migrations: ['./src/database/*.ts'],
      cli: {
        migrationsDir: './src/migrations/migrations/*.ts',
      },
    });
  });

  it('should be login a user with valid credentials', async () => {
    const user = createFakeUser();

    await request(app).post('/sign').send(user);

    const loginResponse = await request(app).post('/login').send({
      email: user.email,
      password: user.password,
    });

    expect(loginResponse.status).toEqual(200);
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body.user.email).toEqual(user.email);
  });

  it('should not login a user with invalid password', async () => {
    const user = createFakeUser();

    await request(app).post('/sign').send(user);

    const loginResponse = await request(app)
      .post('/login')
      .send({ email: user.email, password: '' });

    expect(loginResponse.status).toEqual(400);
    expect(loginResponse.body).toHaveProperty('message');
    expect(loginResponse.body).toHaveProperty('error');
    expect(loginResponse.body.error).toHaveProperty('password');
    expect(loginResponse.body.message).toEqual('Login error');
    expect(loginResponse.body.error.password).toEqual('password is a required field');
  });

  it('should not login a user with invalid email', async () => {
    const user = createFakeUser();

    await request(app).post('/sign').send(user);

    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'mail@mail.com', password: user.password });

    expect(loginResponse.status).toEqual(400);
    expect(loginResponse.body).toHaveProperty('message');
    expect(loginResponse.body).toHaveProperty('error');
    expect(loginResponse.body.message).toEqual('Login error');
    expect(loginResponse.body.error).toEqual('Email is incorrect');
  });
});
