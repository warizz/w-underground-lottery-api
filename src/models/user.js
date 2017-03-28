const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    require: true,
    type: String,
  },
  username: {
    require: true,
    type: String,
  },
  pic_url: String,
  token: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
