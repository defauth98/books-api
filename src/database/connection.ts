import { createConnection } from 'typeorm';

if (process.env.NODE_ENV !== 'test') {
  createConnection({
    entities: ['./src/entities/*.ts'],
    type: 'postgres',
    host: '0.0.0.0',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'books',
  }).then((connection) => {
    if (connection.isConnected === true) {
      console.log('Banco de dados conectado');
    }
  });
}
