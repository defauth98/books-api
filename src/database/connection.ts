import { createConnection } from 'typeorm';

export default createConnection({
  type: 'postgres',
  host: '192.168.1.11',
  username: 'docker',
  password: 'docker',
  database: 'books',
  entities: ['src/entities/*.ts'],
}).then((connection) => {
  if (connection.isConnected) {
    console.log('Banco de dados conectado');
  }
});
