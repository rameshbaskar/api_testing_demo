const { Book } = require('../../app/models/book');
const { Counter } = require('../../app/models/counter');
const faker = require('faker');
const { createDocument, deleteDocument } = require('../../app/utils/dbUtils');

function getBookData() {
  return {
    title: `Simple book on ${faker.company.bs()}`,
    author: faker.name.findName(),
    year: 1988,
    pages: 188
  };
}

async function deleteAllBooks() {
  console.log('Deleting all books...');
  await deleteDocument(Book.deleteMany({}));
}

async function resetBookSequence() {
  console.log('Resetting the book sequence...');
  await deleteDocument(Counter.deleteOne({_id: 'bookId'}));
}

async function addBook() {
  console.log('Adding a new test book into the database...');
  var book = await createDocument(new Book(getBookData()));
  console.log('Added a test book.');
  return book;
}

module.exports = {
  deleteAllBooks, addBook, resetBookSequence, getBookData
}
