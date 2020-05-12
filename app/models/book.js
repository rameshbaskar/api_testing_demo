const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./counter');

const schema = new Schema(
  {
    bookId: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    pages: { type: Number, required: true, min: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

schema.pre('validate', () => {
  if (!this.bookId) this.bookId = getBookSequence();
});

// Set the createdAt (for the first time) and updatedAt (everytime) while saving
schema.pre('save', next => {
  var now = Date.now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

function getBookSequence() {
  var updatedSeqValue = 1;
  Counter.findById('bookId', (err, bookCounter) => {
    if (!bookCounter) {
      new Counter({_id: 'bookId', seqValue: 1}).save((err, counter) => {
        if (!err) updatedSeqValue = 1;
      });
      
    } else {
      bookCounter.seqValue += 1;
      bookCounter.save((err, updatedCounter) => {
        if (!err) updatedSeqValue = updatedCounter.seqValue;
      });
    }
  });
  return updatedSeqValue;
}

module.exports = {
  Book: mongoose.model('Book', schema), 
  getBookSequence: getBookSequence
}
