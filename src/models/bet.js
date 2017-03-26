const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  createdBy: {
    type: String,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Period',
    required: true,
  },
  price1: Number,
  price2: Number,
  price3: Number,
});

BetSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Bet', BetSchema);
