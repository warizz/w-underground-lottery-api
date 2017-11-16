const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    ref: 'User',
    required: true,
  },
  number: {
    type: String,
    required: true,
    match: /^\d{1,3}$/,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  period: {
    type: String,
    ref: 'Period',
    required: true,
  },
  price1: Number,
  price2: Number,
  price3: Number,
}, {
  timestamps: true,
});

BetSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Bet', BetSchema);
