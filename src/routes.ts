import express from 'express';
import AuthController from './controllers/AuthController';
import BooksController from './controllers/BooksController';

const routes = express.Router();

routes.post('/sign', AuthController.create);
routes.post('/login', AuthController.login);

routes.post('/book', BooksController.create);
routes.get('/book/:id', BooksController.show);
routes.get('/book', BooksController.index);
routes.delete('/book/:id', BooksController.delete);
routes.put('/book/:id', BooksController.update);

routes.get('/search', BooksController.search);

export default routes;
