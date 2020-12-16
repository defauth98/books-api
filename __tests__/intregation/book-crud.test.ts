import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../../src/app';

import createFakeBook from '../util/createFakeBook';

describe('Books CRUD', () => {
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

  it('should be create a book', async () => {
    const book = createFakeBook();

    const createBookResponse = await request(app).post('/book').send(book);

    expect(createBookResponse.status).toEqual(200);
    expect(createBookResponse.body).toHaveProperty('title');
    expect(createBookResponse.body).toHaveProperty('description');
  });

  it('should not create a book without a description', async () => {
    const book = createFakeBook();

    const createBookResponse = await request(app).post('/book').send({
      title: book.title,
      description: '',
      price: book.price,
      publisher: book.publisher,
      state_book: book.state_book,
      date_edition: book.date_edition,
      created_at: book.created_at,
    });

    expect(createBookResponse.status).toEqual(400);
  });

  it('should not create a book without a title', async () => {
    const book = createFakeBook();

    const createBookResponse = await request(app).post('/book').send({
      title: '',
      description: book.description,
      price: book.price,
      publisher: book.publisher,
      state_book: book.state_book,
      date_edition: book.date_edition,
      created_at: book.created_at,
    });

    expect(createBookResponse.status).toEqual(400);
  });

  it('should show a book', async () => {
    const book = createFakeBook();

    const createdBookResponse = await request(app).post('/book').send(book);

    const showBookResponse = await request(app).get(
      `/book/${createdBookResponse.body.id}`
    );

    expect(showBookResponse.status).toEqual(200);
    expect(showBookResponse.body).toHaveProperty('title');
    expect(showBookResponse.body).toHaveProperty('description');
  });

  it('should not show a book', async () => {
    const book = createFakeBook();

    const showBookResponse = await request(app).get('/book/999');

    expect(showBookResponse.status).toEqual(400);
  });

  it('should index all books', async () => {
    const showBookResponse = await request(app).get('/book');

    expect(showBookResponse.status).toEqual(200);
  });

  it('should update a book', async () => {
    const book = createFakeBook();

    const createBookResponse = await request(app).post('/book').send(book);

    const newBook = createFakeBook();

    const updateBookResponse = await request(app)
      .put(`/book/${createBookResponse.body.id}`)
      .send(newBook);

    expect(updateBookResponse.status).toEqual(200);
  });

  it('should not update a book', async () => {
    const book = createFakeBook();
    const updateBookResponse = await request(app).put('/book/999').send(book);

    expect(updateBookResponse.status).toEqual(400);
  });

  it('should delete a book', async () => {
    const book = createFakeBook();

    const createdBookResponse = await request(app).post('/book').send(book);

    const deleteBookResponse = await request(app).delete(
      `/book/${createdBookResponse.body.id}`
    );

    expect(deleteBookResponse.status).toEqual(200);
  });

  it('should not delete a book', async () => {
    const deleteBookResponse = await request(app).delete('/book/999');

    expect(deleteBookResponse.status).toEqual(400);
  });

  it('should be search a book by title', async () => {
    const book = createFakeBook();

    await request(app).post('/book').send(book);

    const searchBookResponse = await request(app)
      .get('/search')
      .send({ title: book.title });

    expect(searchBookResponse.status).toEqual(200);
    expect(searchBookResponse.body[0]).toHaveProperty('title');
    expect(searchBookResponse.body[0]).toHaveProperty('description');
  });

  it('should not search a book by title', async () => {
    const searchBookResponse = await request(app)
      .get('/search')
      .send({ title: 'qualquer coisa' });

    expect(searchBookResponse.status).toEqual(400);
  });
});
