import { createConnection } from 'typeorm';

export default createConnection({
  type: 'postgres',
  host: '172.19.0.2',
  username: 'postgres',
  password: 'docker',
}).then((connection) => {
  if (connection.isConnected) {
    console.log('Banco de dados conectado');
  }
});
