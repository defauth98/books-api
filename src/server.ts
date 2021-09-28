import 'dotenv/config';

import express from 'express';
import path from 'path';
import app from './app';

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(process.env.PORT || 3333, () => {
  console.log('Servidor rodando em -> http://localhost:3333');
});
