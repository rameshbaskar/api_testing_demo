const { Book, getBookSequence } = require('../../app/models/book');
const Counter = require('../../app/models/counter');

function getBookData() {
  return {
    title: 'Test book',
    author: 'John Doe',
    year: 1988,
    pages: 188
  };
}

function deleteAllBooks() {
  console.log('Deleting all books from the test database...');
  Book.deleteMany({}, (err) => {});
}

function deleteBookCounter() {
  console.log('Deleting the book counter...');
  Counter.deleteOne({_id: 'bookId'}, (err) => {});
}

function addBook() {
  console.log('Adding a new test book into the database...');
  var data = getBookData();
  var book = new Book(data);
  book.save((err, b) => {
    if (err) console.error(`Error occured while creating book: ${JSON.stringify(err)}`);
  });
  return book;
}

module.exports = {
  deleteAllBooks, addBook, deleteBookCounter, getBookData
}
