import 'dotenv/config';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as yup from 'yup';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Users from '../entities/User';
import userView from '../views/user_view';
import ErrorView from '../views/error_view';

const privateKey = process.env.JWT_PRIVATE_KEY;

export const saltRounds = 10;

const generateToken = (id: string) => jwt.sign({ id }, privateKey, {
  expiresIn: '86400',
});

export default {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;
    const user = { name, email, password };

    const schema = yup.object().shape({
      name: yup.string().required().min(4),
      email: yup.string().email().min(8),
      password: yup.string().required().min(8),
    });

    schema
      .validate(user)
      .then(async () => {
        const password_hash = await bcrypt.hash(password, 2);
        const userRepository = getRepository(Users);
        const User = await userRepository.find({ email });

        if (User.length) {
          return response.status(400).json({
            message: 'Cannot create a user',
            error: 'User has already been created',
          });
        }

        const newUser = userRepository.create({
          name,
          email,
          password: password_hash,
        });

        const savedUser = await userRepository.save(newUser);
        const token = generateToken(String(savedUser.id));

        return response.json({
          message: 'User created successfully',
          user: userView.render(savedUser),
          token,
        });
      })
      .catch((error) => response.status(400).json({
        message: 'Cannot create a user',
        error: ErrorView.render(error),
      }));
  },

  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    const user = { email, password };

    const schema = yup.object().shape({
      email: yup.string().email().min(8),
      password: yup.string().required().min(8),
    });

    schema
      .validate(user)
      .then(async () => {
        const userRepository = getRepository(Users);

        const User = await userRepository.findOne({ email });

        if (!User) {
          return response
            .status(400)
            .json({ message: 'Login error', error: 'Email is incorrect' });
        }

        const userPassword = User.password;
        const isValidPass = await bcrypt.compare(password, userPassword);

        if (isValidPass === true) {
          const token = generateToken(String(User.id));

          return response.json({ user: userView.render(User), token });
        }
        return response
          .status(400)
          .json({ message: 'Login error', error: 'Password is incorrect' });
      })
      .catch((error) => response.status(400).json({
        message: 'Login error',
        error: ErrorView.render(error),
      }));
  },
};
