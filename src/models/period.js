const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
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
});

module.exports = mongoose.model('Period', PeriodSchema);
