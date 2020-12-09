import request from 'supertest';
import app from '../../src/app';

import createFakeUser from '../util/createFakeUser';

describe('User login', () => {
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
