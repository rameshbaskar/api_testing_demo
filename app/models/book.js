const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Counter } = require('./counter');
const { findDocument, createDocument, updateDocument } = require('../utils/dbUtils');

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

schema.pre('validate', async function(next) {
  var seq = await getBookSequence();
  if (!this.bookId) this.bookId = seq.seqValue;
  next();
});

// Set the createdAt (for the first time) and updatedAt (everytime) while saving
schema.pre('save', function(next) {
  var now = Date.now;
  if (!this.createdAt) this.createdAt = now;
  this.updatedAt = now;
  next();
});

async function getBookSequence() {
  console.log('Getting book sequence...');
  var existingSeq = await findDocument(Counter.findOne({_id: 'bookId'}));
  if (existingSeq) {
    console.log('Sequence exists. So incrementing the sequence value.');
    existingSeq += 1;
    return await updateDocument(Counter.findOneAndUpdate({_id: 'bookId'}, {$inc: {seqValue: 1}}, {upsert: true, new: true}));
  } else {
    console.log('Sequence does not exist. So creating a new sequence.');
    return await createDocument(new Counter({_id: 'bookId', seqValue: 1}));
  }
}

module.exports = {
  Book: mongoose.model('Book', schema), 
  getBookSequence: getBookSequence
}
