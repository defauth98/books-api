import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import AuthController from './controllers/AuthController';
import BooksController from './controllers/BooksController';
import PublisherController from './controllers/PublisherController';

// import Authentication from './middlewares/authentication';

const upload = multer(multerConfig);

const routes = express.Router();

routes.post('/login', AuthController.login);
routes.post('/sign', AuthController.create);

routes.post('/publisher', PublisherController.create);

routes.post('/book', upload.single('book_cover'), BooksController.create);
routes.get('/book/:id', BooksController.show);
routes.get('/book', BooksController.index);
routes.delete('/book/:id', BooksController.delete);
routes.put('/book/:id', BooksController.update);

routes.get('/search', BooksController.search);

export default routes;
