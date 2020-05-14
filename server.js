const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');
const SERVER_PORT = 8080;
const book = require('./app/routes/bookRoutes');
const app = express();

const dbOptions = {
  useMongoClient: true,
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
};

// DB Connection
mongoose.connect(config.DBHost, dbOptions);
mongoose.Promise = require('bluebird');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error: '));

// Stop the logs when testing
if (config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

app.get('/', function(req, res) {
  res.status(200).json({ message: 'Welcome to our Bookstore !!' });
});

app.route('/books')
    .get(book.getBooks);

app.route('/books/:bookId')
    .get(book.getBook);

app.route('/book')
    .post(book.addBook);

app.route('/book/:bookId')
    .put(book.updateBook)
    .delete(book.deleteBook);

function startServer() {
  console.log('Starting server...');
  var server = app.listen(SERVER_PORT, async () => {
    console.log(`API server now up and listening on port: ${SERVER_PORT}`);
  });
  return server;
}

module.exports = startServer;
