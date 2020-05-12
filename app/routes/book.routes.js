const { Book, getBookSequence } = require('../models/book');

// GET /books
function getBooks(req, res) {
  Book.find({}).exec((err, books) => {
    if (err) return res.status(500).json({ message: 'An error occured while fetching the books !!!', err });
    if (books.length == 0) return res.status(404).json({ message: 'No books are available !!!' });
    return res.status(200).json({ message: 'Here are the available books.', books });
  });
}

// GET /books/:id
function getBook(req, res) {
  var id = parseInt(req.params.bookId);
  Book.findOne({bookId: id}, (err, book) => {
    if (err) return res.status(500).json({ message: `An error occured while fetching the book with id: ${id} !!!`, err });
    if (!book) return res.status(404).json({ message: `Book with id: ${id} does not exist !!!` });
    return res.status(200).json({ message: 'Here is the book you are looking for.', book });
  });
}

// POST /book
function addBook(req, res) {
  var newBook = new Book(req.body);
  newBook.bookId = getBookSequence();
  newBook.save((err, book) => {
    if (err) return res.status(500).json({ message: 'An error occured while adding a new book !!!', err });
    res.status(200).json({ message: 'Book successfully added.', book });
  });
}

// PUT /book/:id
function updateBook(req, res) {
  var id = parseInt(req.params.bookId);
  Book.findOne({bookId: id}, (err, book) => {
    if (err) return res.status(500).json({ message: `An error occured while fetching the book with id: ${id} !!!`, err });
    if (!book) return res.status(404).json({ message: `Book with id: ${id} does not exist !!!` });
    Object.assign(book, req.body).save((err, book) => {
      if (err) return res.status(500).json({ message: 'An error occured while updating the book !!!', err });
      return res.status(200).json({ message: 'Book successfully updated.', book });
    });
  });
}

// DELETE /book/:id
function deleteBook(req, res) {
  var id = parseInt(req.params.bookId);
  Book.findOne({bookId: id}, (err, book) => {
    if (err) return res.status(500).json({ message: `An error occured while fetching the book with id: ${id} !!!`, err });
    if (!book) return res.status(404).json({ message: `Book with id: ${id} does not exist !!!` });
    Book.deleteOne({bookId: id}, (err) => {
      if (err) return res.status(500).json({ message: 'An error occured while deleting the book !!!', err });
      return res.status(200).json({ message: 'Book successfully deleted.' });
    });
  });
}

module.exports = {
  getBooks, getBook, addBook, updateBook, deleteBook
}
