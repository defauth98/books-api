import faker from 'faker';

function createFakeBook() {
  const book = {
    title: faker.name.findName(),
    description: faker.lorem.paragraph(1),
  };

  return book;
}

export default createFakeBook;
