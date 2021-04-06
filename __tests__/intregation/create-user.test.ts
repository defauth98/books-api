import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../../src/app';

import createFakeUser from '../util/createFakeUser';

describe('User creation', () => {
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

  it('should be create a user with valid credentials', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send(user);

    expect(createUserResponse.status).toEqual(200);
  });

  it('not should be create a user without a name', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send({
      name: '',
      email: user.email,
      password: user.password,
    });

    expect(createUserResponse.body.message).toEqual('Não foi informado o nome');
    expect(createUserResponse.status).toEqual(400);
  });

  it('not should be create a user without a email', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send({
      name: user.name,
      email: '',
      password: user.password,
    });

    expect(createUserResponse.body.message).toEqual(
      'Não foi informado o email'
    );
    expect(createUserResponse.status).toEqual(400);
  });

  it('not should be create a user without a password', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send({
      name: user.name,
      email: user.email,
      password: '',
    });

    expect(createUserResponse.status).toEqual(400);
    expect(createUserResponse.body.message).toEqual(
      'Não foi informado a senha'
    );
  });

  it('should give a jwt token when accont has been created', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send(user);

    expect(createUserResponse.body).toHaveProperty('token');
    expect(createUserResponse.status).toEqual(200);
  });

  it('should not create a accont with a emails who already exists', async () => {
    const user = createFakeUser();

    await request(app).post('/sign').send(user);

    const secondRequest = await request(app).post('/sign').send(user);

    expect(secondRequest.body).toHaveProperty('error');
    expect(secondRequest.status).toEqual(400);
  });
});
