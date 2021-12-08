import { createConnection } from 'typeorm';

if (process.env.PORT) {
  createConnection({
    entities: ['./src/entities/*.ts'],
    type: 'postgres',
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    url: process.env.DATABASE_URL,
  })
    .then((connection) => {
      if (connection.isConnected === true) {
        console.log('Banco de dados conectado');
      }
    })
    .catch((error) => console.error(error));
} else {
  createConnection({
    entities: ['./src/entities/*.ts'],
    type: 'postgres',
    host: 'postgres',
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
}
