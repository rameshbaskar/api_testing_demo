const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    _id: { type: String, required: true },
    seqValue: { type: Number, default: 1 }
  },
  {
    versionKey: false
  }
);

module.exports.Counter = mongoose.model('Counter', schema);
