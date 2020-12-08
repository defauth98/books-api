import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

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

      const savedUser = await userRepository.save(newUser);

      const token = generateToken(String(savedUser.id));

      return response.json({ user: savedUser, token });
    } catch (error) {
      console.log(error.message);
      return response.send({ error: error.message });
    }
  },

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const userRepository = getRepository(Users);

    try {
      const user = await userRepository.find({ email });

      const userPassword = user[0].password;

      const isValidPass = bcrypt.compare(userPassword, password);

      if (isValidPass) {
        const token = generateToken(String(user[0].id));

        return response.json({ token });
      }
    } catch (error) {
      return response.json({ error: error.message });
    }
  },
};
