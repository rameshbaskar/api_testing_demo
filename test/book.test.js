const { deleteAllBooks, addBook, deleteBookCounter, getBookData } = require('./factories/bookFactory');
const chai = require('chai');
const chaiHttp = require('chai-http');
const startServer = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Bookstore', () => {
  let server = undefined;

  before(() => {
    server = startServer();
  });

  beforeEach(() => {
    deleteAllBooks();
    deleteBookCounter();
  });

  it('route "GET /" should return welcome message', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.eql('Welcome to our Bookstore !!');
        done();
      });
  });

  describe('route "GET /books"', () => {
    it('should return empty when there are no books', (done) => {
      chai.request(server)
        .get('/books')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.books).to.be.undefined;
          expect(res.body.message).to.eql('No books are available !!!');
          done();
        });
    });
  
    it('should return valid books when books are available', (done) => {
      var book = addBook();
      chai.request(server)
        .get('/books')
        .end((err, res) => {
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

    it('should return more than 1 book when available', (done) => {
      var book1 = addBook();
      addBook();
      chai.request(server)
        .get('/books')
        .end((err, res) => {
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
          done();
        });
    });
  });

  describe('route "GET /books/:bookId"', () => {
    it('should return empty when the book is not available', (done) => {
      chai.request(server)
        .get('/books/1')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.book).to.be.undefined;
          expect(res.body.message).to.eql('Book with id: 1 does not exist !!!');
          done();
        });
    });
  
    it('should return valid book when book is available', (done) => {
      var book = addBook();
      chai.request(server)
        .get(`/books/${book.bookId}`)
        .end((err, res) => {
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

  describe('route "POST /book"', () => {
    it('should create a valid book', (done) => {
      var reqBody = getBookData();
      chai.request(server)
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end((err, res) => {
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

    it('should throw an error when title is missing', (done) => {
      var reqBody = getBookData();
      reqBody.title = undefined;
      chai.request(server)
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when author is missing', (done) => {
      var reqBody = getBookData();
      reqBody.author = undefined;
      chai.request(server)
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when year is missing', (done) => {
      var reqBody = getBookData();
      reqBody.year = undefined;
      chai.request(server)
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when pages is missing', (done) => {
      var reqBody = getBookData();
      reqBody.pages = undefined;
      chai.request(server)
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    it('should throw an error when pages is 0', (done) => {
      var reqBody = getBookData();
      reqBody.pages = 0;
      chai.request(server)
        .post('/book')
        .set('content-type', 'application/json')
        .send(reqBody)
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe('route "PUT /book/:bookId"', () => {
    it('should throw an error when updating a book that does not exist', (done) => {
      var reqBody = getBookData();
      chai.request(server)
        .put(`/book/${reqBody.bookId}`)
        .set('content-type', 'application/json')
        .send({title: 'New title'})
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.eql(`Book with id: ${reqBody.bookId} does not exist !!!`);
          done();
        });
    });

    it('should update the book when valid', (done) => {
      var book = addBook();
      chai.request(server)
        .put(`/book/${book.bookId}`)
        .set('content-type', 'application/json')
        .send({title: 'New title'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.eql('Book successfully updated.');

          var receivedBook = res.body.book;
          expect(receivedBook.bookId).to.eql(book.bookId);
          expect(receivedBook.title).to.eql('New title');
          expect(receivedBook.author).to.eql(book.author);
          expect(receivedBook.year).to.eql(book.year);
          expect(receivedBook.pages).to.eql(book.pages);
          done();
        });
    });
  });
});
