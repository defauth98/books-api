<h1 align="center">Books API :books:</h1>

<p align="center">
  <a href="#desktop_computer-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#nut_and_bolt-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#tractor-como-rodar-o-projeto">Como rodar o projeto?</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#whale-criando-um-container-com-o-docker">Docker</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#autor">Autor</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#licença">Licença</a>
</p>

<h1 align="center">

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=books-api&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fdefauth98%2Fbooks-api%2Fmaster%2FInsomnia_2021-08-06.json)

</h1>

### :desktop_computer: Projeto

Uma API para um sebo de livros. Onde é possível cadastrar um usuário e logar. E também cadastrar, editar e apagar livros.

### :nut_and_bolt: Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Typescript](https://www.typescriptlang.org/)
- [Node JS](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Typeorm](https://typeorm.io/#/)
- [Faker](https://www.npmjs.com/package/faker)
- [Supertest](https://www.npmjs.com/package/supertest)
- [Jest](https://jestjs.io/)
- [Eslint](https://eslint.org/)

### :whale: Criando um container com o docker

[Clique aqui](https://docs.docker.com/engine/install/) para instalar o docker na sua maquina

```sh
# Inicie o docker
sudo systemctl start docker

# Cria um container do docker com o postgresql
docker run --name postgres-container -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

### :tractor: Como rodar o projeto?

Você vai precisar ter docker instalado na sua máquina para rodar o banco de dados PostgreSQL ou instalar diretamente na sua máquina.

:warning: Lembre-se de configurar o arquivo .env

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

- Github: [@defauth98](https://github.com/defauth98)
- LinkedIn: [@daniel-ribeiro-397604164](https://linkedin.com/in/daniel-ribeiro-397604164)

### Licença

The [MIT License]() (MIT)

Copyright :copyright: 2020 - Books API
