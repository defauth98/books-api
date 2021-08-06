import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Books from '../entities/Book';

export default {
  async create(request: Request, response: Response) {
    const {
      title,
      description,
      price,
      publisherId,
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

    try {
      const bookRepository = getRepository(Books);
      const book = new Books();

      book.title = title
      book.description = description
      book.price = price
      book.state_book = state_book
      book.date_edition = date_edition
      book.publisher = publisherId

      const savedBook = await bookRepository.save(book);

      return response.json(savedBook);
    } catch (error) {
      console.error(error)
    }
    
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.findOneOrFail({ where: { id }, relations:['publisher']});

      return response.json({book});
    } catch (error) {
      return response.status(400).json({ error });
    }
  },

  async index(request: Request, response: Response) {
    const bookRepository = getRepository(Books);

    const books = await bookRepository.find({relations:['publisher']});

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
      publisherId,
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
        book.publisher = publisherId;
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
