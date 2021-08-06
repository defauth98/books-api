import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Publisher from '../entities/Publisher';

export default {
  async create(request: Request, response: Response) {
    const { name } = request.body;

    const publisherRepository = getRepository(Publisher);

    const publisher = publisherRepository.create({
      name
    });

    const savedPublisher = await publisherRepository.save(publisher);

    return response.json(savedPublisher);
  },
};
