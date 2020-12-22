import express from 'express';
import AuthController from './controllers/AuthController';
import BooksController from './controllers/BooksController';

import Authentication from './middlewares/authentication';

const routes = express.Router();

routes.post('/sign', AuthController.create);
routes.post('/login', AuthController.login);

routes.post('/book', Authentication, BooksController.create);
routes.get('/book/:id', BooksController.show);
routes.get('/book', BooksController.index);
routes.delete('/book/:id', Authentication, BooksController.delete);
routes.put('/book/:id', Authentication, BooksController.update);

routes.get('/search', BooksController.search);

export default routes;
