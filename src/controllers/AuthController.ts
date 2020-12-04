import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import userView from '../views/user_view';
import Users from '../entities/User';

const secret = process.env.APP_SECRET as string;

export const saltRounds = 10;

function generateToken(id: string) {
  return jwt.sign({ id }, secret, {
    expiresIn: 86400,
  });
}

export default {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const password_hash = await bcrypt.hash(password, 2);

    const userRepository = getRepository(Users);

    try {
      const newUser = userRepository.create({
        name,
        email,
        password: password_hash,
      });

      await userRepository.save(newUser);

      return response.json(newUser);
    } catch (err) {
      console.log(err.message);
      return response.send({ error: 'Erro ao tentar cadastrar um usuário' });
    }
  },
};
