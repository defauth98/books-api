import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../../src/app';

import createFakeUser from '../util/createFakeUser';

describe('User login', () => {
  beforeAll(async () => {
    await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'docker',
      password: 'docker',
      database: 'books',
      entities: ['./src/entities/*.ts'],
      migrations: ['./src/database/*.ts'],
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
  });

  it('should not login a user with invalid password', async () => {
    const user = createFakeUser();

    await request(app).post('/sign').send(user);

    const loginResponse = await request(app)
      .post('/login')
      .send({ email: user.email, password: '' });

    expect(loginResponse.status).toEqual(400);
  });

  it('should not login a user with invalid email', async () => {
    const user = createFakeUser();

    await request(app).post('/sign').send(user);

    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'mail@mail.com', password: user.password });

    expect(loginResponse.status).toEqual(400);
  });
});
