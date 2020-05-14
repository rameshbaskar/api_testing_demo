const { Book } = require('../models/book');
const { execFind, execCreate, execDelete, execUpdateWithValidation } = require('../utils/dbUtils');

// GET /books
async function getBooks(req, res) {
  var books = await execFind(Book.find({}));
  if (!books) {
    return res.status(500).json({ message: 'An error occured while fetching the books !!!' });
  } else {
    if (books.length === 0) return await res.status(404).json({ message: 'No books are available !!!' });
    return res.status(200).json({ message: 'Here are the available books.', books: books });
  }
}

// GET /books/:id
async function getBook(req, res) {
  var id = parseInt(req.params.bookId);
  var book = await execFind(Book.findOne({bookId: id}));
  if (!book) return res.status(404).json({ message: `Book with id: ${id} does not exist !!!` });
  return res.status(200).json({ message: 'Here is the book you are looking for.', book: book });
}

// POST /book
async function addBook(req, res) {
  try {
    var book = await execCreate(new Book(req.body));
    return res.status(200).json({ message: 'Book successfully added.', book: book });
  } catch(e) {
    return res.status(500).json({ message: 'An error occured while adding a new book !!!', error: e });
  }
}

// PUT /book/:id
async function updateBook(req, res) {
  var id = parseInt(req.params.bookId);
  var originalBook = await execFind(Book.findOne({bookId: id}));
  if (!originalBook) return res.status(404).json({ message: `Book with id: ${id} does not exist !!!` });
  try {
    var updatedBook = await execUpdateWithValidation(Object.assign(originalBook, req.body));
    return res.status(200).json({ message: 'Book successfully updated.', book: updatedBook });
  } catch(e) {
    return res.status(500).json({ message: 'An error occured while updating the book !!!', error: e });
  }
}

// DELETE /book/:id
async function deleteBook(req, res) {
  var id = parseInt(req.params.bookId);
  var book = await execFind(Book.findOne({bookId: id}));
  if (!book) return res.status(404).json({ message: `Book with id: ${id} does not exist !!!` });
  var isDeleted = await execDelete(Book.deleteOne({bookId: id}));
  if (!isDeleted) return res.status(500).json({ message: 'An error occured while deleting the book !!!' });
  return res.status(200).json({ message: 'Book successfully deleted.' });
}

module.exports = {
  getBooks, getBook, addBook, updateBook, deleteBook
}
