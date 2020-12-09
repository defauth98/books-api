import faker from 'faker';

function createFakeUser() {
  const user = {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: faker.internet.password(),
  };

  return user;
}

export default createFakeUser;
