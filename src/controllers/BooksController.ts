import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Books from '../entities/Book';

export default {
  async create(request: Request, response: Response) {
    const {
      title,
      description,
      price,
      publisher,
      state_book,
      date_edition,
    } = request.body;

    if (title.length < 2) {
      return response
        .status(400)
        .json({ error: 'O título do livro não foi informado' });
    }

    if (description.length < 2) {
      return response
        .status(400)
        .json({ error: 'A descrição do livro não foi informada' });
    }

    const bookRepository = getRepository(Books);

    const book = bookRepository.create({
      title,
      description,
      price,
      publisher,
      state_book,
      date_edition,
    });

    const savedBook = await bookRepository.save(book);

    return response.json(savedBook);
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.findOneOrFail({ where: { id } });

      return response.json(book);
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async index(request: Request, response: Response) {
    const bookRepository = getRepository(Books);

    const books = await bookRepository.find();

    return response.json(books);
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.findOneOrFail(id);

      await bookRepository.delete(book);

      return response.send();
    } catch (error) {
      return response.status(400).json(error);
    }
  },

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const {
      title,
      description,
      date_edition,
      price,
      publisher,
      state_book,
      created_at,
    } = request.body;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.findOne(id);

      if (book) {
        book.title = title;
        book.description = description;
        book.date_edition = date_edition;
        book.price = price;
        book.publisher = publisher;
        book.state_book = state_book;
        book.created_at = created_at;
      }

      await bookRepository.save(book);

      return response.json(book);
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async search(request: Request, response: Response) {
    const { title } = request.body;

    const bookRepository = getRepository(Books);

    const book = await bookRepository.find({
      select: ['title', 'description'],
      where: { title },
    });

    if (book[0]) {
      return response.json(book);
    }

    return response
      .status(400)
      .json({ error: 'Não foi possivel encontrar um livro com esse titulo' });
  },
};
