import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Books from '../entities/Books';

export default {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const bookRepository = getRepository(Books);

    try {
      const book = bookRepository.create({ title, description });
      const savedBook = await bookRepository.save(book);

      return response.json(savedBook);
    } catch (error) {
      return response.json({ error });
    }
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.findOneOrFail({ where: { id } });

      return response.json(book);
    } catch (error) {
      return response.json({ error });
    }
  },

  async index(request: Request, response: Response) {
    const bookRepository = getRepository(Books);

    try {
      const books = await bookRepository.find();

      return response.json(books);
    } catch (error) {
      return response.json({ error });
    }
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const bookRepository = getRepository(Books);

    try {
      await bookRepository.delete(id);

      return response.send();
    } catch (error) {
      return response.json(error);
    }
  },

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { title, description } = request.body;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.findOne(id);

      if (book) {
        book.title = title;
        book.description = description;
      }

      await bookRepository.save(book);

      return response.json(book);
    } catch (error) {
      return response.json({ error });
    }
  },

  async search(request: Request, response: Response) {
    const { title } = request.body;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.find({
        select: ['title', 'description'],
        where: { title },
      });

      return response.json(book);
    } catch (error) {
      return response.json({ error });
    }
  },
};
