import express from 'express';
// import './database/connection';
import routes from './routes';

import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(routes);

export default app;
