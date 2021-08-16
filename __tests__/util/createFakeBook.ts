import faker from 'faker';

function createFakeBook() {
  const book = {
    title: faker.name.findName(),
    description: faker.lorem.paragraph(1),
    price: 100,
    publisherName: faker.name.findName(),
    state_book: 'Bom estado',
    date_edition: faker.date.recent(),
  };

  return book;
}

export default createFakeBook;
