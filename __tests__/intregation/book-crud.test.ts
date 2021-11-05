import request from 'supertest';
import { createConnection } from 'typeorm';
import fs from 'mz/fs'

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

    const filePath = `${__dirname}/../assets/book.jpg`;

    await request(app)
      .post('/book')
      .field('title', book.title)
      .field('description', book.description)
      .field('publisherName', book.publisherName)
      .field('price', book.price)
      .field('state_book', book.state_book)
      .field('date_edition', `${book.date_edition}`)
      .attach('book_cover', filePath)
      .expect(200)
      .then(res => {
        const body = res.body

        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('description');
        expect(body).toHaveProperty('price');
        expect(body).toHaveProperty('state_book');
        expect(body).toHaveProperty('date_edition');
        expect(body).toHaveProperty('publisher');
        expect(body).toHaveProperty('image_path');
        expect(body).toHaveProperty('id');
      })
  });

  it('should not create a book without a description', async () => {
    const book = createFakeBook();

    const filePath = `${__dirname}/../assets/book.jpg`;

    await request(app)
      .post('/book')
      .field('title', book.title)
      .field('publisherName', book.publisherName)
      .field('price', book.price)
      .field('state_book', book.state_book)
      .field('date_edition', `${book.date_edition}`)
      .attach('book_cover', filePath)
      .expect(400)
      .then(res => {
        const body = res.body

        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('error');
        expect(body.error).toEqual('Description is required');
      })
  });

  it('should not create a book without a title', async () => {
    const book = createFakeBook();

    const filePath = `${__dirname}/../assets/book.jpg`;

    await request(app)
      .post('/book')
      .field('description', book.description)
      .field('publisherName', book.publisherName)
      .field('price', book.price)
      .field('state_book', book.state_book)
      .field('date_edition', `${book.date_edition}`)
      .attach('book_cover', filePath)
      .expect(400)
      .then(res => {
        const body = res.body

        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('error');
        expect(body.error).toEqual('Title is required');
      })

  });

  it('should show a book', async () => {
    const book = createFakeBook();

    const filePath = `${__dirname}/../assets/book.jpg`;

    await request(app)
      .post('/book')
      .field('title', book.title)
      .field('description', book.description)
      .field('publisherName', book.publisherName)
      .field('price', book.price)
      .field('state_book', book.state_book)
      .field('date_edition', `${book.date_edition}`)
      .attach('book_cover', filePath)
      .expect(200)
      .then(async res => {
        const body = res.body

        await request(app).get(
          `/book/${body.id}`
        ).expect(200)
          .then(res => {
            const body = res.body

            expect(body.book).toHaveProperty('title');
            expect(body.book).toHaveProperty('description');
            expect(body.book).toHaveProperty('price');
            expect(body.book).toHaveProperty('state_book');
            expect(body.book).toHaveProperty('date_edition');
            expect(body.book).toHaveProperty('image_path');
            expect(body.book).toHaveProperty('publisher');
          })
      })

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

    const filePath = `${__dirname}/../assets/book.jpg`;

    await request(app)
      .post('/book')
      .field('title', book.title)
      .field('description', book.description)
      .field('publisherName', book.publisherName)
      .field('price', book.price)
      .field('state_book', book.state_book)
      .field('date_edition', `${book.date_edition}`)
      .attach('book_cover', filePath)
      .expect(200)
      .then(async res => {
        const body = res.body

        const book = createFakeBook();

        const filePath = `${__dirname}/../assets/book.jpg`;

        await request(app)
          .put(`/book/${body.id}`)
          .field('description', book.description)
          .field('publisherName', book.publisherName)
          .field('price', book.price)
          .field('state_book', book.state_book)
          .field('date_edition', `${book.date_edition}`)
          .attach('book_cover', filePath)
          .then(res => {
            const body = res.body;

            expect(body).toHaveProperty('message')
            expect(body.book).toHaveProperty('id');
            expect(body.book).toHaveProperty('image_path');
          })
      })

  });

  it('should not update a book', async () => {
    const book = createFakeBook();
    const updateBookResponse = await request(app).put('/book/999').send(book);

    expect(updateBookResponse.status).toEqual(400);
    expect(updateBookResponse.body.error).toEqual('Book not found');
  });

  it('should delete a book', async () => {
    const book = createFakeBook();

    const filePath = `${__dirname}/../assets/book.jpg`;

    const createdBookResponse = await request(app)
      .post('/book')
      .field('title', book.title)
      .field('description', book.description)
      .field('publisherName', book.publisherName)
      .field('price', book.price)
      .field('state_book', book.state_book)
      .field('date_edition', `${book.date_edition}`)
      .attach('book_cover', filePath)

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

    const filePath = `${__dirname}/../assets/book.jpg`;

    await request(app)
      .post('/book')
      .field('title', book.title)
      .field('description', book.description)
      .field('publisherName', book.publisherName)
      .field('price', book.price)
      .field('state_book', book.state_book)
      .field('date_edition', `${book.date_edition}`)
      .attach('book_cover', filePath)
      .then(async () => {
        await request(app)
          .get('/search')
          .query({ title: book.title })
          .expect(200)
      })

  });
});
