const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  facebookId: {
    require: true,
    type: String,
  },
  tokens: [
    {
      type: String,
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
