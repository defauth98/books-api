import app from './app';
import 'dotenv/config';

app.listen(process.env.NODE_PORT || 3333, () => {
  console.log('Servidor rodando em -> http://localhost:3333');
});
