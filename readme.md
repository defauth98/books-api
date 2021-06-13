<h1 align="center">Books API :books:</h1>

> Uma API para um sebo de livros.

### :nut_and_bolt: Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Typescript](https://www.typescriptlang.org/)
- [Node JS](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Typeorm](https://typeorm.io/#/)
- [Faker](https://www.npmjs.com/package/faker)
- [Supertest](https://www.npmjs.com/package/supertest)
- [Jest](https://jestjs.io/)

### :tractor: Como rodar o projeto?

Você vai precisar ter docker instalado na sua máquina para rodar o banco de dados PostgreSQL ou instalar diretamente na sua máquina.

```bash
# Clone o repositório
git clone https://github.com/defauth98/books-api.gi books-api

# Entre no diretório do projeto
cd books-api

# Instale as dependencias
yarn

# Rode as migrations
yarn migrate

# Configure o seu api em /src/services/api.ts e rode o app
yarn start
```

### Autor

👤 **Daniel Ribeiro**

- Twitter: [@defauth8](https://twitter.com/defauth8)
- Github: [@defauth98](https://github.com/defauth98)
- LinkedIn: [@daniel-ribeiro-397604164](https://linkedin.com/in/daniel-ribeiro-397604164)

## Licença

The [MIT License]() (MIT)

Copyright :copyright: 2020 - Books API
