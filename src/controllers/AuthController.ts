import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import 'dotenv/config';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Users from '../entities/User';

const privateKey = process.env.JWT_PRIVATE_KEY;

export const saltRounds = 10;

function generateToken(id: string) {
  return jwt.sign({ id }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '86400',
  });
}

export default {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    if (name.length < 2) {
      return response.status(400).json({ message: 'Não foi informado o nome' });
    }

    if (email.length < 2) {
      return response
        .status(400)
        .json({ message: 'Não foi informado o email' });
    }

    if (password.length < 2) {
      return response
        .status(400)
        .json({ message: 'Não foi informado a senha' });
    }

    const password_hash = await bcrypt.hash(password, 2);

    const userRepository = getRepository(Users);

    try {
      const newUser = userRepository.create({
        name,
        email,
        password: password_hash,
      });

      const savedUser = await userRepository.save(newUser);

      const token = generateToken(String(savedUser.id));

      return response.json({ user: savedUser, token });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  },

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const userRepository = getRepository(Users);

    try {
      const user = await userRepository.findOneOrFail({ email });

      const userPassword = user.password;

      const isValidPass = await bcrypt.compare(password, userPassword);

      if (isValidPass === true) {
        const token = generateToken(String(user.id));

        return response.json({ user, token });
      } else {
        return response
          .status(400)
          .json({ error: 'Não foi possível fazer o login' });
      }
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  },
};
