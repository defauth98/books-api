import { createConnection } from 'typeorm';

if (process.env.NODE_ENV !== 'test') {
  createConnection({
    entities: ['./src/entities/*.ts'],
    type: 'postgres',
    host: '172.19.0.2',
    port: 5432,
    username: 'postgres',
    password: 'book',
    database: 'books',
  })
    .then((connection) => {
      if (connection.isConnected === true) {
        console.log('Banco de dados conectado');
      }
    })
    .catch((error) => console.error(error));
}
