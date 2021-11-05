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
    expect(createUserResponse.body).toHaveProperty('user');
    expect(createUserResponse.body).toHaveProperty('token');
    expect(createUserResponse.body.user).toHaveProperty('id');
    expect(createUserResponse.body.user).toHaveProperty('email');
  });

  it('not should be create a user without a name', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send({
      name: '',
      email: user.email,
      password: user.password,
    });

    expect(createUserResponse.status).toEqual(400);
    expect(createUserResponse.body.message).toEqual('Cannot create a user')
    expect(createUserResponse.body.error.name).toEqual('name is a required field')
  });

  it('not should be create a user without a email', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send({
      name: user.name,
      email: '',
      password: user.password
    });

    expect(createUserResponse.status).toEqual(400);
    expect(createUserResponse.body.message).toEqual('Cannot create a user')
    expect(createUserResponse.body.error.email).toEqual('email must be at least 8 characters');
  });

  it('not should be create a user without a password', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send({
      name: user.name,
      email: user.email,
      password: '',
    });

    expect(createUserResponse.status).toEqual(400);
    expect(createUserResponse.body.message).toEqual('Cannot create a user')
    expect(createUserResponse.body.error.password).toEqual('password is a required field');
  });

  it('should give a jwt token when accont has been created', async () => {
    const user = createFakeUser();

    const createUserResponse = await request(app).post('/sign').send(user);

    expect(createUserResponse.status).toEqual(200);
    expect(createUserResponse.body).toHaveProperty('token');
    expect(createUserResponse.body).toHaveProperty('user');
    expect(createUserResponse.body.user.email).toEqual(user.email);
  });

  it('should not create a accont with a emails who already exists', async () => {
    const user = createFakeUser();
    await request(app).post('/sign').send(user);
    const secondRequest = await request(app).post('/sign').send(user);

    expect(secondRequest.body).toHaveProperty('error');
    expect(secondRequest.body.error).toEqual('User has already been created');
    expect(secondRequest.status).toEqual(400);
  });
});
