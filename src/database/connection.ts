import { createConnection } from 'typeorm';

if (process.env.NODE_ENV !== 'test') {
  createConnection({
    entities: ['../entities/Livro.ts'],
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'books',
  }).then((connection) => console.log(connection.isConnected));
}
