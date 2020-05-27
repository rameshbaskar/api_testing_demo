const { deleteAllBooks, addBook, resetBookSequence, getBookData } = require('./factories/bookFactory');
const chai = require('chai');
const chaiHttp = require('chai-http');
const startServer = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Bookstore', function() {
  let server;
  let request;

  before(function() {
    console.log('****PREPARING TEST SUITE');
    server = startServer();
  });

  beforeEach(async function() {
    console.log('************ PREPARING TEST');
    await deleteAllBooks();
    await resetBookSequence();
    request = chai.request(server);
  });

  it('route "GET /" should return welcome message', function(done) {
    request
      .get('/')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.message).to.eql('Welcome to our Bookstore !!');
        done();
      });
  });

  describe('route "GET /books"', function() {
    it('should return empty when there are no books', function(done) {
      request
        .get('/books')
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body.books).to.be.undefined;
          expect(res.body.message).to.eql('No books are available !!!');
          done();
        });
    });
  
    it('should return valid books when books are available', async function(done) {
      var book = await addBook();
      request
        .get('/books')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.books).to.be.a('array');
          expect(res.body.message).to.eql('Here are the available books.');
          expect(res.body.books.length).to.eql(1);
          
          var receivedBook = res.body.books[0];
          expect(receivedBook.bookId).to.eql(book.bookId);
          expect(receivedBook.title).to.eql(book.title);
          expect(receivedBook.author).to.eql(book.author);
          expect(receivedBook.year).to.eql(book.year);
          expect(receivedBook.pages).to.eql(book.pages);
          done();
        });
    });

    it('should return more than 1 book when available', async function(done) {
      var book1 = await addBook();
      await addBook();
      request
        .get('/books')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.books).to.be.a('array');
          expect(res.body.message).to.eql('Here are the available books.');
          expect(res.body.books.length).to.eql(2);
          
          var receivedBook = res.body.books[0];
          expect(receivedBook.bookId).to.eql(book1.bookId);
          expect(receivedBook.title).to.eql(book1.title);
          expect(receivedBook.author).to.eql(book1.author);
          expect(receivedBook.year).to.eql(book1.year);
          expect(receivedBook.pages).to.eql(book1.pages);
          expect(res.body.books[1].bookId).to.eql(2);
          done();
        });
    });
  });

  describe('route "GET /books/:bookId"', function() {
    it('should return empty when the book is not available', function(done) {
      request
        .get('/books/1')
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body.book).to.be.undefined;
          expect(res.body.message).to.eql('Book with id: 1 does not exist !!!');
          done();
        });
    });
  
    it('should return valid book when book is available', async function(done) {
      var book = await addBook();
      request
        .get(`/books/${book.bookId}`)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('Here is the book you are looking for.');

          var receivedBook = res.body.book;
          expect(receivedBook.bookId).to.eql(book.bookId);
          expect(receivedBook.title).to.eql(book.title);
          expect(receivedBook.author).to.eql(book.author);
          expect(receivedBook.year).to.eql(book.year);
          expect(receivedBook.pages).to.eql(book.pages);
          done();
        });
    });
  });

  describe('route "POST /book"', function() {
    it('should create a valid book', function(done) {
      var reqBody = getBookData();
      request
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('Book successfully added.');

          var receivedBook = res.body.book;
          expect(receivedBook.bookId).to.eql(1);
          expect(receivedBook.title).to.eql(reqBody.title);
          expect(receivedBook.author).to.eql(reqBody.author);
          expect(receivedBook.year).to.eql(reqBody.year);
          expect(receivedBook.pages).to.eql(reqBody.pages);
          done();
        });
    });

    it('should throw an error when title is missing', function(done) {
      var reqBody = getBookData();
      reqBody.title = undefined;
      request
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when author is missing', function(done) {
      var reqBody = getBookData();
      reqBody.author = undefined;
      request
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when year is missing', function(done) {
      var reqBody = getBookData();
      reqBody.year = undefined;
      request
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when pages is missing', function(done) {
      var reqBody = getBookData();
      reqBody.pages = undefined;
      request
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when pages is 0', function(done) {
      var reqBody = getBookData();
      reqBody.pages = 0;
      request
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe('route "PUT /book/:bookId"', function() {
    it('should throw an error when updating a book that does not exist', function(done) {
      var reqBody = getBookData();
      request
        .put(`/book/1`)
        .set('content-type', 'application/json')
        .send({title: 'New title'})
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body.message).to.eql(`Book with id: 1 does not exist !!!`);
          done();
        });
    });

    it('should update the title when valid', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({title: 'New title'})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('Book successfully updated.');

          var receivedBook = res.body.book;
          expect(receivedBook.bookId).to.eql(originalBook.bookId);
          expect(receivedBook.title).to.eql('New title');
          expect(receivedBook.author).to.eql(originalBook.author);
          expect(receivedBook.year).to.eql(originalBook.year);
          expect(receivedBook.pages).to.eql(originalBook.pages);
          done();
        });
    });

    it('should update the author when valid', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({author: 'New Author'})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('Book successfully updated.');

          var receivedBook = res.body.book;
          expect(receivedBook.bookId).to.eql(originalBook.bookId);
          expect(receivedBook.title).to.eql(originalBook.title);
          expect(receivedBook.author).to.eql('New Author');
          expect(receivedBook.year).to.eql(originalBook.year);
          expect(receivedBook.pages).to.eql(originalBook.pages);
          done();
        });
    });

    it('should update the year when valid', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({year: 2020})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('Book successfully updated.');

          var receivedBook = res.body.book;
          expect(receivedBook.bookId).to.eql(originalBook.bookId);
          expect(receivedBook.title).to.eql(originalBook.title);
          expect(receivedBook.author).to.eql(originalBook.author);
          expect(receivedBook.year).to.eql(2020);
          expect(receivedBook.pages).to.eql(originalBook.pages);
          done();
        });
    });

    it('should update the pages when valid', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({pages: 100})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('Book successfully updated.');

          var receivedBook = res.body.book;
          expect(receivedBook.bookId).to.eql(originalBook.bookId);
          expect(receivedBook.title).to.eql(originalBook.title);
          expect(receivedBook.author).to.eql(originalBook.author);
          expect(receivedBook.year).to.eql(originalBook.year);
          expect(receivedBook.pages).to.eql(100);
          done();
        });
    });

    it('should throw an error when removing the title', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({title: null})
        .end(function(err, res) {
          expect(res).to.have.status(500);
          expect(res.body.message).to.eql('An error occured while updating the book !!!');
          done();
        });
    });

    it('should throw an error when removing the author', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({author: null})
        .end(function(err, res) {
          expect(res).to.have.status(500);
          expect(res.body.message).to.eql('An error occured while updating the book !!!');
          done();
        });
    });

    it('should throw an error when removing the year', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({year: null})
        .end(function(err, res) {
          expect(res).to.have.status(500);
          expect(res.body.message).to.eql('An error occured while updating the book !!!');
          done();
        });
    });

    it('should throw an error when removing the pages', async function(done) {
      var originalBook = await addBook();
      request
        .put(`/book/${originalBook.bookId}`)
        .set('content-type', 'application/json')
        .send({pages: null})
        .end(function(err, res) {
          expect(res).to.have.status(500);
          expect(res.body.message).to.eql('An error occured while updating the book !!!');
          done();
        });
    });
  });
});
