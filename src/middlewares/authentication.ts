import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import 'dotenv/config';

export default (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) return response.status(401).send('Token não informado');

  // Divide o token
  // Bearer - token
  const [, token] = authHeader.split(' ');

  try {
    const publicKey = process.env.JWT_PUBLIC_KEY;

    console.log(publicKey);

    const payload = <any>jwt.verify(token, publicKey);

    response.locals.jwtPayload = payload;

    return next();
  } catch (error) {
    return response.status(401).send('Invalid token');
  }
};
