const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  bets: {
    createdAt: {
      type: Date,
      default: new Date(),
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    price1: {
      type: Number,
    },
    price2: {
      type: Number,
    },
    price3: {
      type: Number,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
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
})

const LogSchema = new mongoose.Schema({
  actors: String,
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  director: String,
  imdbID: {
    type: String,
    required: true,
  },
  poster: String,
  rating: {
    type: Number,
    min: 1,
    max: 4,
    required: true,
  },
  title: {
    required: true,
    trim: true,
    type: String,
  },
  year: {
    require: true,
    type: Number,
  },
});

module.exports = mongoose.model('Log', LogSchema);
