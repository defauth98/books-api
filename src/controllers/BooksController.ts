import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Books from '../entities/Book';
import Publisher from '../entities/Publisher';

import ErrorView from '../views/error_view'

export default {
  async create(request: Request, response: Response) {
    const {
      title,
      description,
      price,
      publisherName,
      state_book,
      date_edition,
    } = request.body;

    if (title.length < 2) {
      return response
        .status(400)
        .json({ message: "Cannot create a book", error: "Title is required" });
    }

    if (description.length < 2) {
      return response
        .status(400)
        .json({message: "Cannot create a book", error: "Description is required" });
    }

    try {
      const bookRepository = getRepository(Books);
      const publisherRepository = getRepository(Publisher);
      const image_path = 'http://localhost:3333/uploads/' + 'request.file.filename';
      
      let publisherId: any;
      let publisher = await publisherRepository.findOne({name: publisherName})

      if(publisher) {
        publisherId = publisher.id;
      } else {
        const newPublisher = new Publisher();

        newPublisher.name = publisherName;

        const savedPublisher = await publisherRepository.save(newPublisher);

        publisherId = savedPublisher.id;
      }

      const book = new Books();

      book.title = title
      book.description = description
      book.price = price
      book.state_book = state_book
      book.date_edition = date_edition
      book.publisher = publisherId
      book.image_path = image_path

      const savedBook = await bookRepository.save(book);

      return response.status(200).json(savedBook);
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
      return response.status(400).json({ error: 'Book not found' });
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
      const book = await bookRepository.findOne(id);

      if(!book) {
        return response.status(400).json({message: 'Delete failed', error: 'Book not found'});
      }

      await bookRepository.remove(book);

      return response.status(204).json({message: 'Book deleted successfully'});
    } catch (error) {
      return response.status(400).json({message: 'Delete failed', error: ErrorView.render(error)});
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
    } = request.body;

    const bookRepository = getRepository(Books);

    try {
      const book = await bookRepository.findOne(id);

      if(!book) {
        return response.status(400).json({ message: 'Cannot update book', error: 'Book not found' });
      }

      if (book) {
        book.title = title;
        book.description = description;
        book.date_edition = date_edition;
        book.price = price;
        book.publisher = publisherId;
        book.state_book = state_book;
      }

      await bookRepository.save(book);

      return response.json({message: "Updated book", book});
    } catch (error) {
      return response.status(400).json({ message: 'Cannot update book' });
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
      .json({ error: 'Cannot find book' });
  },
};
