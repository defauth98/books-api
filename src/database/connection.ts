import { createConnection } from 'typeorm';

createConnection({
  entities: ['./src/entities/*.ts'],
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'books',
})
  .then((connection) => {
    if (connection.isConnected === true) {
      console.log('Banco de dados conectado');
    }
  })
  .catch((error) => console.error(error));
