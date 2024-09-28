const express = require('express');
const mongoose = require('mongoose');
const UserTransaction = require('./models/Transations'); // Ensure this is the correct model for transactions
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

require('dotenv').config();
const MongoUrl=process.env.MongoURL
mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/transactions/:name', async (req, res) => {
  try {
    const user = await UserTransaction.findOne({ name: req.params.name });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.transactions); 
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


app.post('/api/transactions/:name', async (req, res) => {
  try {
    let user = await UserTransaction.findOne({ name: req.params.name });

    if (!user) {
      user = new UserTransaction({ name: req.params.name, transactions: [] });
    }

    user.transactions.push(req.body);
    await user.save();

    res.status(201).json({ message: 'Transaction added successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await UserTransaction.distinct('name'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
app.post('/api/users/:name', async (req, res) => {
  const name=req.params.name;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const existingUser = await UserTransaction.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new UserTransaction({ name, transactions: [] });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/api/transactions/:name/:transactionId', async (req, res) => {
  try {
    const user = await UserTransaction.findOne({ name: req.params.name });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const transactionIndex = user.transactions.findIndex(transaction => transaction.id.toString() === req.params.transactionId);
    
    if (transactionIndex === -1) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const deletedTransaction = user.transactions.splice(transactionIndex, 1);

    await user.save();

    res.json({ message: 'Transaction deleted', transaction: deletedTransaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
