import 'dotenv/config';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as yup from 'yup';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Users from '../entities/User';
import userView from '../views/user_view';

const privateKey = process.env.JWT_PRIVATE_KEY;

export const saltRounds = 10;

const generateToken = (id: string) => {
  return jwt.sign({ id }, privateKey, {
    expiresIn: '86400',
  });
};

export default {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;
    const user = {name, email, password};

    let schema = yup.object().shape({
      name: yup.string().required().min(4),
      email: yup.string().email().min(8),
      password: yup.string().required().min(8),
    });

    try {
      schema
      .validate(user)
      .then(async user => {
        const password_hash = await bcrypt.hash(password, 2);
        
        const userRepository = getRepository(Users);
        
        const User = await userRepository.find({ email });

        if(User.length) {
          return response.status(400).json({error: 'User has already been created'})
        }

        const newUser = userRepository.create({
          name,
          email,
          password: password_hash,
        });

        const savedUser = await userRepository.save(newUser);

        const token = generateToken(String(savedUser.user_id));

        return response.json({ user: userView.render(savedUser), token });
      })
      .catch(err => {
        console.log(err)
        return response.status(400).json(err);
      })
    } catch (error) {
      console.log(error.message)

      return response.status(400).json({ error: 'cannot create user' });
    }
  },

  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    const user = {email, password};

    let schema = yup.object().shape({
      email: yup.string().email().min(8),
      password: yup.string().required().min(8),
    });

      schema
      .validate(user)
      .then(async user => {
        try {
          const userRepository = getRepository(Users);
    
          const User = await userRepository.findOneOrFail({ email });
    
          const userPassword = User.password;
    
          const isValidPass = await bcrypt.compare(password, userPassword);
    
          if (isValidPass === true) {
            const token = generateToken(String(user.id));
    
            return response.json({ user: userView.render(User), token });
          } else {
            return response
              .status(400)
              .json({ error: 'Não foi possível fazer o login' });
          }
        } catch (error) {
          console.log(error);

          return response.status(400).json({ error: 'Não foi possível fazer o login' });
        }
      })
      .catch(err => {
        const error = {[err.path]:[...err.errors]}

        return response.status(400).json({error});
      })
  },
};
