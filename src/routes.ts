import express from 'express';
import AuthController from './controllers/AuthController';

const routes = express.Router();

routes.post('/sign', AuthController.create);

export default routes;
