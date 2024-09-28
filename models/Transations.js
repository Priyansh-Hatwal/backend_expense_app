const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  id: String,
  text: String,
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserTransactionSchema = new mongoose.Schema({
  name: String,
  transactions: [TransactionSchema] 
});

module.exports = mongoose.model('UserTransaction', UserTransactionSchema);
  