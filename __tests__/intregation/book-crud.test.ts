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
    expect(createBookResponse.body).toHaveProperty('price');
    expect(createBookResponse.body).toHaveProperty('state_book');
    expect(createBookResponse.body).toHaveProperty('date_edition');
    expect(createBookResponse.body).toHaveProperty('publisher');
    expect(createBookResponse.body).toHaveProperty('image_path');
    expect(createBookResponse.body).toHaveProperty('id');
  });

  it('should not create a book without a description', async () => {
    const book = createFakeBook();

    const createBookResponse = await request(app).post('/book').send({
      title: book.title,
      description: '',
      price: book.price,
      publisher: book.publisherName,
      state_book: book.state_book,
      date_edition: book.date_edition,
    });

    expect(createBookResponse.status).toEqual(400);
    expect(createBookResponse.body).toHaveProperty('message');
    expect(createBookResponse.body).toHaveProperty('error');
    expect(createBookResponse.body.error).toEqual('Description is required');
  });

  it('should not create a book without a title', async () => {
    const book = createFakeBook();

    const createBookResponse = await request(app).post('/book').send({
      title: '',
      description: book.description,
      price: book.price,
      publisherName: book.publisherName,
      state_book: book.state_book,
      date_edition: book.date_edition,
    });


    expect(createBookResponse.status).toEqual(400);
    expect(createBookResponse.body).toHaveProperty('message');
    expect(createBookResponse.body).toHaveProperty('error');
    expect(createBookResponse.body.error).toEqual('Title is required');
  });

  it('should show a book', async () => {
    const book = createFakeBook();

    const createdBookResponse = await request(app).post('/book').send(book);

    const showBookResponse = await request(app).get(
      `/book/${createdBookResponse.body.id}`
    );

    expect(showBookResponse.status).toEqual(200);
    expect(showBookResponse.body.book).toHaveProperty('title');
    expect(showBookResponse.body.book).toHaveProperty('description');
    expect(showBookResponse.body.book).toHaveProperty('price');
    expect(showBookResponse.body.book).toHaveProperty('state_book');
    expect(showBookResponse.body.book).toHaveProperty('date_edition');
    expect(showBookResponse.body.book).toHaveProperty('image_path');
    expect(showBookResponse.body.book).toHaveProperty('publisher');
  });

  it('should not show a book', async () => {
    const showBookResponse = await request(app).get('/book/999');

    expect(showBookResponse.status).toEqual(400);
    expect(showBookResponse.body.error).toEqual('Book not found');
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
    expect(updateBookResponse.body.message).toEqual('Updated book');
    expect(updateBookResponse.body.book).toHaveProperty('title');
    expect(updateBookResponse.body.book).toHaveProperty('description');
    expect(updateBookResponse.body.book).toHaveProperty('price');
    expect(updateBookResponse.body.book).toHaveProperty('state_book');
    expect(updateBookResponse.body.book).toHaveProperty('date_edition');
    expect(updateBookResponse.body.book).toHaveProperty('image_path');
  });

  it('should not update a book', async () => {
    const book = createFakeBook();
    const updateBookResponse = await request(app).put('/book/999').send(book);

    expect(updateBookResponse.status).toEqual(400);
    expect(updateBookResponse.body.error).toEqual('Book not found');
  });

  it('should delete a book', async () => {
    const book = createFakeBook();

    const createdBookResponse = await request(app).post('/book').send(book);

    const deleteBookResponse = await request(app).delete(
      `/book/${createdBookResponse.body.id}`
    );

    expect(deleteBookResponse.status).toEqual(204);
  });

  it('should not delete a book', async () => {
    const deleteBookResponse = await request(app).delete('/book/999');

    expect(deleteBookResponse.status).toEqual(400);
    expect(deleteBookResponse.body).toHaveProperty('message');
    expect(deleteBookResponse.body).toHaveProperty('error');
    expect(deleteBookResponse.body.error).toEqual('Book not found');
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
    expect(searchBookResponse.body.error).toEqual('Cannot find book');
  });
});
