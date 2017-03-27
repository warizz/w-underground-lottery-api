const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }],
  createdBy: {
    type: String,
    required: true,
  },
  endedAt: {
    type: Date,
    required: true,
  },
  isOpen: {
    default: true,
    type: Boolean,
    required: true,
  },
  result: {
    six: String,
    two: String,
    firstThree: String,
    secondThree: String,
  }
}, {
  timestamps: true
});

PeriodSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Period', PeriodSchema);
